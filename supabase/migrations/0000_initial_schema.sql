-- 0000_initial_schema.sql

-- Enable specific extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Enums
CREATE TYPE public.user_role AS ENUM ('owner', 'admin', 'staff');
CREATE TYPE public.booking_status AS ENUM ('draft', 'confirmed', 'active', 'completed', 'cancelled');
CREATE TYPE public.contract_status AS ENUM ('draft', 'sent', 'signed', 'void');

-- --------------------------------------------------------------------------
-- 1. Core Structure
-- --------------------------------------------------------------------------

-- Tenants (Client Businesses)
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Users (Staff mapping to auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role public.user_role DEFAULT 'staff' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Customers (End-renters)
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    email TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Locations
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- --------------------------------------------------------------------------
-- 2. Inventory & Operations
-- --------------------------------------------------------------------------

-- Inventory Items
CREATE TABLE public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id),
    name TEXT NOT NULL,
    sku TEXT,
    description TEXT,
    daily_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Bookings
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status public.booking_status DEFAULT 'draft' NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Booking Line Items
CREATE TABLE public.booking_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id),
    quantity INTEGER DEFAULT 1 NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- --------------------------------------------------------------------------
-- 3. Contracts and Media Evidence
-- --------------------------------------------------------------------------

-- Contracts (DocuSign link)
CREATE TABLE public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    docusign_envelope_id TEXT,
    status public.contract_status DEFAULT 'draft' NOT NULL,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Inspections
CREATE TABLE public.inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id),
    type TEXT CHECK (type IN ('pre-rental', 'post-rental')) NOT NULL,
    notes TEXT,
    inspector_id UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Media
CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- --------------------------------------------------------------------------
-- 4. Initial Row Level Security (RLS) configuration
-- --------------------------------------------------------------------------

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch the current user's tenant_id securely
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT tenant_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

-- RLS Policy Maker template
-- (Applied across operational tables bounding access strictly to matched tenant_id)

DO $$ 
DECLARE
  table_name TEXT;
  tables TEXT[] := ARRAY['customers', 'locations', 'inventory_items', 'bookings', 'booking_line_items', 'contracts', 'inspections', 'media'];
BEGIN
  FOREACH table_name IN ARRAY tables LOOP
    EXECUTE format(
      'CREATE POLICY "Tenant isolation for %I" ON public.%I FOR ALL USING (tenant_id = public.get_current_tenant_id());',
      table_name, table_name
    );
  END LOOP;
END $$;

-- Policies for Users: Users can see the rest of their team
CREATE POLICY "Users can view users in same tenant" ON public.users
    FOR SELECT USING (tenant_id = public.get_current_tenant_id());

-- Policies for Tenants: Users can see their own overarching tenant detail
CREATE POLICY "Users can view their own tenant profile" ON public.tenants
    FOR SELECT USING (id = public.get_current_tenant_id());

-- Storage Bucket Creation for Condition Evidence
-- Note: Must be executed by a user with enough privileges or Supabase superuser role.
INSERT INTO storage.buckets (id, name, public) VALUES ('condition-evidence', 'condition-evidence', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('signed-contracts', 'signed-contracts', false) ON CONFLICT DO NOTHING;
