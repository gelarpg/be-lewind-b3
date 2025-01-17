PGDMP         $            	    |            b3    12.20    12.20 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16570    b3    DATABASE     �   CREATE DATABASE b3 WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE b3;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    3            �            1259    16776    activity_log    TABLE     @  CREATE TABLE public.activity_log (
    id integer NOT NULL,
    description text NOT NULL,
    ip character varying,
    user_agent character varying NOT NULL,
    status boolean NOT NULL,
    error_detail text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
     DROP TABLE public.activity_log;
       public         heap    postgres    false    3            �            1259    16774    activity_log_id_seq    SEQUENCE     �   CREATE SEQUENCE public.activity_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.activity_log_id_seq;
       public          postgres    false    3    239            �           0    0    activity_log_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.activity_log_id_seq OWNED BY public.activity_log.id;
          public          postgres    false    238            �            1259    16764    clients    TABLE     �  CREATE TABLE public.clients (
    id integer NOT NULL,
    name character varying,
    company_name character varying,
    address text NOT NULL,
    offer_number character varying NOT NULL,
    transaction_fee double precision DEFAULT '0'::double precision,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
    DROP TABLE public.clients;
       public         heap    postgres    false    3            �            1259    16762    clients_id_seq    SEQUENCE     �   CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.clients_id_seq;
       public          postgres    false    3    237            �           0    0    clients_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;
          public          postgres    false    236            �            1259    16755    clients_waste    TABLE     A  CREATE TABLE public.clients_waste (
    id integer NOT NULL,
    client_id integer NOT NULL,
    waste_id integer NOT NULL,
    waste_cost double precision DEFAULT '0'::double precision,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
 !   DROP TABLE public.clients_waste;
       public         heap    postgres    false    3            �            1259    16753    clients_waste_id_seq    SEQUENCE     �   CREATE SEQUENCE public.clients_waste_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.clients_waste_id_seq;
       public          postgres    false    3    235            �           0    0    clients_waste_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.clients_waste_id_seq OWNED BY public.clients_waste.id;
          public          postgres    false    234            �            1259    16744    dashboard_orders    TABLE     �   CREATE TABLE public.dashboard_orders (
    id integer NOT NULL,
    status integer NOT NULL,
    date character varying NOT NULL,
    total integer NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
 $   DROP TABLE public.dashboard_orders;
       public         heap    postgres    false    3            �            1259    16742    dashboard_orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.dashboard_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.dashboard_orders_id_seq;
       public          postgres    false    3    233            �           0    0    dashboard_orders_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.dashboard_orders_id_seq OWNED BY public.dashboard_orders.id;
          public          postgres    false    232            �            1259    16733    driver    TABLE     `  CREATE TABLE public.driver (
    id integer NOT NULL,
    name character varying NOT NULL,
    age integer NOT NULL,
    phone_number character varying NOT NULL,
    address text NOT NULL,
    active boolean NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
    DROP TABLE public.driver;
       public         heap    postgres    false    3            �            1259    16722    driver_documents    TABLE     v  CREATE TABLE public.driver_documents (
    id integer NOT NULL,
    driver_id integer NOT NULL,
    type character varying NOT NULL,
    doc_number character varying,
    path text NOT NULL,
    validity_period timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
 $   DROP TABLE public.driver_documents;
       public         heap    postgres    false    3            �            1259    16720    driver_documents_id_seq    SEQUENCE     �   CREATE SEQUENCE public.driver_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.driver_documents_id_seq;
       public          postgres    false    3    229            �           0    0    driver_documents_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.driver_documents_id_seq OWNED BY public.driver_documents.id;
          public          postgres    false    228            �            1259    16731    driver_id_seq    SEQUENCE     �   CREATE SEQUENCE public.driver_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.driver_id_seq;
       public          postgres    false    3    231            �           0    0    driver_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.driver_id_seq OWNED BY public.driver.id;
          public          postgres    false    230            �            1259    16711    generated_invoice    TABLE       CREATE TABLE public.generated_invoice (
    id integer NOT NULL,
    company_name character varying NOT NULL,
    start_date character varying NOT NULL,
    end_date character varying NOT NULL,
    path character varying NOT NULL,
    created_at timestamp without time zone
);
 %   DROP TABLE public.generated_invoice;
       public         heap    postgres    false    3            �            1259    16709    generated_invoice_id_seq    SEQUENCE     �   CREATE SEQUENCE public.generated_invoice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.generated_invoice_id_seq;
       public          postgres    false    3    227            �           0    0    generated_invoice_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.generated_invoice_id_seq OWNED BY public.generated_invoice.id;
          public          postgres    false    226            �            1259    16700    roles    TABLE     �   CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
    DROP TABLE public.roles;
       public         heap    postgres    false    3            �            1259    16698    roles_id_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.roles_id_seq;
       public          postgres    false    3    225            �           0    0    roles_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;
          public          postgres    false    224            �            1259    16686 
   submission    TABLE     0  CREATE TABLE public.submission (
    id integer NOT NULL,
    order_id character varying,
    driver_id integer,
    client_id integer NOT NULL,
    transportation_id integer,
    period date,
    service_fee double precision,
    status integer,
    waste_cost integer,
    payment_status boolean DEFAULT false,
    travel_fee_status boolean DEFAULT false,
    transfer_amount double precision DEFAULT '0'::double precision,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
    DROP TABLE public.submission;
       public         heap    postgres    false    3            �            1259    16674    submission_details    TABLE     �  CREATE TABLE public.submission_details (
    id integer NOT NULL,
    submission_id integer,
    waste_id integer,
    driver_id integer,
    transportation_id integer,
    period timestamp without time zone,
    qty integer NOT NULL,
    total double precision,
    transport_target text,
    invoice_status boolean DEFAULT false,
    doc_number character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
 &   DROP TABLE public.submission_details;
       public         heap    postgres    false    3            �            1259    16672    submission_details_id_seq    SEQUENCE     �   CREATE SEQUENCE public.submission_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.submission_details_id_seq;
       public          postgres    false    3    221            �           0    0    submission_details_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.submission_details_id_seq OWNED BY public.submission_details.id;
          public          postgres    false    220            �            1259    16663    submission_documents    TABLE     M  CREATE TABLE public.submission_documents (
    id integer NOT NULL,
    submission_id integer NOT NULL,
    type character varying NOT NULL,
    doc_number character varying,
    path text NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
 (   DROP TABLE public.submission_documents;
       public         heap    postgres    false    3            �            1259    16661    submission_documents_id_seq    SEQUENCE     �   CREATE SEQUENCE public.submission_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.submission_documents_id_seq;
       public          postgres    false    219    3            �           0    0    submission_documents_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.submission_documents_id_seq OWNED BY public.submission_documents.id;
          public          postgres    false    218            �            1259    16684    submission_id_seq    SEQUENCE     �   CREATE SEQUENCE public.submission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.submission_id_seq;
       public          postgres    false    223    3            �           0    0    submission_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.submission_id_seq OWNED BY public.submission.id;
          public          postgres    false    222            �            1259    16652    submission_status    TABLE     �   CREATE TABLE public.submission_status (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    type character varying
);
 %   DROP TABLE public.submission_status;
       public         heap    postgres    false    3            �            1259    16650    submission_status_id_seq    SEQUENCE     �   CREATE SEQUENCE public.submission_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.submission_status_id_seq;
       public          postgres    false    217    3            �           0    0    submission_status_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.submission_status_id_seq OWNED BY public.submission_status.id;
          public          postgres    false    216            �            1259    16641    transportation    TABLE     �  CREATE TABLE public.transportation (
    id integer NOT NULL,
    transportation_type_id integer NOT NULL,
    name character varying NOT NULL,
    no_police character varying NOT NULL,
    year character varying NOT NULL,
    capacity integer NOT NULL,
    fuel_type character varying NOT NULL,
    active boolean NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
 "   DROP TABLE public.transportation;
       public         heap    postgres    false    3            �            1259    16630    transportation_documents    TABLE     �  CREATE TABLE public.transportation_documents (
    id integer NOT NULL,
    transportation_id integer NOT NULL,
    type character varying NOT NULL,
    doc_number character varying,
    path text NOT NULL,
    validity_period timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
 ,   DROP TABLE public.transportation_documents;
       public         heap    postgres    false    3            �            1259    16628    transportation_documents_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transportation_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.transportation_documents_id_seq;
       public          postgres    false    213    3                        0    0    transportation_documents_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.transportation_documents_id_seq OWNED BY public.transportation_documents.id;
          public          postgres    false    212            �            1259    16639    transportation_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transportation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.transportation_id_seq;
       public          postgres    false    3    215                       0    0    transportation_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.transportation_id_seq OWNED BY public.transportation.id;
          public          postgres    false    214            �            1259    16619    transportation_license    TABLE     �  CREATE TABLE public.transportation_license (
    id integer NOT NULL,
    transportation_id integer NOT NULL,
    validity_period_kir timestamp without time zone,
    attachment_kir text,
    validity_period_stnk timestamp without time zone,
    attachment_stnk text,
    validity_period_rekom timestamp without time zone,
    attachment_rekom text,
    validity_period_supervision_card timestamp without time zone,
    attachment_supervision_card text,
    validity_period_departement_permit timestamp without time zone,
    attachment_departement_permit text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
 *   DROP TABLE public.transportation_license;
       public         heap    postgres    false    3            �            1259    16617    transportation_license_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transportation_license_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.transportation_license_id_seq;
       public          postgres    false    211    3                       0    0    transportation_license_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.transportation_license_id_seq OWNED BY public.transportation_license.id;
          public          postgres    false    210            �            1259    16608    transportation_type    TABLE       CREATE TABLE public.transportation_type (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
 '   DROP TABLE public.transportation_type;
       public         heap    postgres    false    3            �            1259    16606    transportation_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transportation_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.transportation_type_id_seq;
       public          postgres    false    209    3                       0    0    transportation_type_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.transportation_type_id_seq OWNED BY public.transportation_type.id;
          public          postgres    false    208            �            1259    16596    users    TABLE        CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    username character varying(50),
    email character varying(50) NOT NULL,
    ip character varying(50),
    password character varying(250) NOT NULL,
    phone character varying(50),
    token character varying(500),
    active boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
    DROP TABLE public.users;
       public         heap    postgres    false    3            �            1259    16594    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    207    3                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    206            �            1259    16785    users_roles_roles    TABLE     f   CREATE TABLE public.users_roles_roles (
    user_id integer NOT NULL,
    role_id integer NOT NULL
);
 %   DROP TABLE public.users_roles_roles;
       public         heap    postgres    false    3            �            1259    16584    waste    TABLE     �  CREATE TABLE public.waste (
    id integer NOT NULL,
    waste_type_id integer,
    waste_code character varying(10),
    name character varying NOT NULL,
    weight_unit character varying NOT NULL,
    price_unit double precision DEFAULT '0'::double precision,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
    DROP TABLE public.waste;
       public         heap    postgres    false    3            �            1259    16582    waste_id_seq    SEQUENCE     �   CREATE SEQUENCE public.waste_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.waste_id_seq;
       public          postgres    false    3    205                       0    0    waste_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.waste_id_seq OWNED BY public.waste.id;
          public          postgres    false    204            �            1259    16573 
   waste_type    TABLE     
  CREATE TABLE public.waste_type (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);
    DROP TABLE public.waste_type;
       public         heap    postgres    false    3            �            1259    16571    waste_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.waste_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.waste_type_id_seq;
       public          postgres    false    3    203                       0    0    waste_type_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.waste_type_id_seq OWNED BY public.waste_type.id;
          public          postgres    false    202                       2604    16779    activity_log id    DEFAULT     r   ALTER TABLE ONLY public.activity_log ALTER COLUMN id SET DEFAULT nextval('public.activity_log_id_seq'::regclass);
 >   ALTER TABLE public.activity_log ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    238    239    239                       2604    16767 
   clients id    DEFAULT     h   ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);
 9   ALTER TABLE public.clients ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    237    236    237                       2604    16758    clients_waste id    DEFAULT     t   ALTER TABLE ONLY public.clients_waste ALTER COLUMN id SET DEFAULT nextval('public.clients_waste_id_seq'::regclass);
 ?   ALTER TABLE public.clients_waste ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    234    235                       2604    16747    dashboard_orders id    DEFAULT     z   ALTER TABLE ONLY public.dashboard_orders ALTER COLUMN id SET DEFAULT nextval('public.dashboard_orders_id_seq'::regclass);
 B   ALTER TABLE public.dashboard_orders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    232    233    233                       2604    16736 	   driver id    DEFAULT     f   ALTER TABLE ONLY public.driver ALTER COLUMN id SET DEFAULT nextval('public.driver_id_seq'::regclass);
 8   ALTER TABLE public.driver ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    231    231                       2604    16725    driver_documents id    DEFAULT     z   ALTER TABLE ONLY public.driver_documents ALTER COLUMN id SET DEFAULT nextval('public.driver_documents_id_seq'::regclass);
 B   ALTER TABLE public.driver_documents ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    229    229                       2604    16714    generated_invoice id    DEFAULT     |   ALTER TABLE ONLY public.generated_invoice ALTER COLUMN id SET DEFAULT nextval('public.generated_invoice_id_seq'::regclass);
 C   ALTER TABLE public.generated_invoice ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    227    227                       2604    16703    roles id    DEFAULT     d   ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);
 7   ALTER TABLE public.roles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224    225                       2604    16689    submission id    DEFAULT     n   ALTER TABLE ONLY public.submission ALTER COLUMN id SET DEFAULT nextval('public.submission_id_seq'::regclass);
 <   ALTER TABLE public.submission ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222    223                       2604    16677    submission_details id    DEFAULT     ~   ALTER TABLE ONLY public.submission_details ALTER COLUMN id SET DEFAULT nextval('public.submission_details_id_seq'::regclass);
 D   ALTER TABLE public.submission_details ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221                       2604    16666    submission_documents id    DEFAULT     �   ALTER TABLE ONLY public.submission_documents ALTER COLUMN id SET DEFAULT nextval('public.submission_documents_id_seq'::regclass);
 F   ALTER TABLE public.submission_documents ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219            
           2604    16655    submission_status id    DEFAULT     |   ALTER TABLE ONLY public.submission_status ALTER COLUMN id SET DEFAULT nextval('public.submission_status_id_seq'::regclass);
 C   ALTER TABLE public.submission_status ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216    217            	           2604    16644    transportation id    DEFAULT     v   ALTER TABLE ONLY public.transportation ALTER COLUMN id SET DEFAULT nextval('public.transportation_id_seq'::regclass);
 @   ALTER TABLE public.transportation ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215                       2604    16633    transportation_documents id    DEFAULT     �   ALTER TABLE ONLY public.transportation_documents ALTER COLUMN id SET DEFAULT nextval('public.transportation_documents_id_seq'::regclass);
 J   ALTER TABLE public.transportation_documents ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    212    213                       2604    16622    transportation_license id    DEFAULT     �   ALTER TABLE ONLY public.transportation_license ALTER COLUMN id SET DEFAULT nextval('public.transportation_license_id_seq'::regclass);
 H   ALTER TABLE public.transportation_license ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    210    211                       2604    16611    transportation_type id    DEFAULT     �   ALTER TABLE ONLY public.transportation_type ALTER COLUMN id SET DEFAULT nextval('public.transportation_type_id_seq'::regclass);
 E   ALTER TABLE public.transportation_type ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    208    209                       2604    16599    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    207    206    207                       2604    16587    waste id    DEFAULT     d   ALTER TABLE ONLY public.waste ALTER COLUMN id SET DEFAULT nextval('public.waste_id_seq'::regclass);
 7   ALTER TABLE public.waste ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    205    204    205                       2604    16576    waste_type id    DEFAULT     n   ALTER TABLE ONLY public.waste_type ALTER COLUMN id SET DEFAULT nextval('public.waste_type_id_seq'::regclass);
 <   ALTER TABLE public.waste_type ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202    203            �          0    16776    activity_log 
   TABLE DATA           u   COPY public.activity_log (id, description, ip, user_agent, status, error_detail, created_at, updated_at) FROM stdin;
    public          postgres    false    239   ��       �          0    16764    clients 
   TABLE DATA           �   COPY public.clients (id, name, company_name, address, offer_number, transaction_fee, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    237   ��       �          0    16755    clients_waste 
   TABLE DATA           p   COPY public.clients_waste (id, client_id, waste_id, waste_cost, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    235   {�       �          0    16744    dashboard_orders 
   TABLE DATA           O   COPY public.dashboard_orders (id, status, date, total, updated_at) FROM stdin;
    public          postgres    false    233   ��       �          0    16733    driver 
   TABLE DATA           r   COPY public.driver (id, name, age, phone_number, address, active, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    231   �       �          0    16722    driver_documents 
   TABLE DATA           �   COPY public.driver_documents (id, driver_id, type, doc_number, path, validity_period, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    229   ��       �          0    16711    generated_invoice 
   TABLE DATA           e   COPY public.generated_invoice (id, company_name, start_date, end_date, path, created_at) FROM stdin;
    public          postgres    false    227   ��       �          0    16700    roles 
   TABLE DATA           G   COPY public.roles (id, name, slug, created_at, updated_at) FROM stdin;
    public          postgres    false    225   ��       �          0    16686 
   submission 
   TABLE DATA           �   COPY public.submission (id, order_id, driver_id, client_id, transportation_id, period, service_fee, status, waste_cost, payment_status, travel_fee_status, transfer_amount, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    223   d�       �          0    16674    submission_details 
   TABLE DATA           �   COPY public.submission_details (id, submission_id, waste_id, driver_id, transportation_id, period, qty, total, transport_target, invoice_status, doc_number, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    221   7�       �          0    16663    submission_documents 
   TABLE DATA           }   COPY public.submission_documents (id, submission_id, type, doc_number, path, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    219   3�       �          0    16652    submission_status 
   TABLE DATA           A   COPY public.submission_status (id, name, slug, type) FROM stdin;
    public          postgres    false    217   p�       �          0    16641    transportation 
   TABLE DATA           �   COPY public.transportation (id, transportation_type_id, name, no_police, year, capacity, fuel_type, active, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    215   ��       �          0    16630    transportation_documents 
   TABLE DATA           �   COPY public.transportation_documents (id, transportation_id, type, doc_number, path, validity_period, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    213   ��       �          0    16619    transportation_license 
   TABLE DATA           b  COPY public.transportation_license (id, transportation_id, validity_period_kir, attachment_kir, validity_period_stnk, attachment_stnk, validity_period_rekom, attachment_rekom, validity_period_supervision_card, attachment_supervision_card, validity_period_departement_permit, attachment_departement_permit, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    211   ��       �          0    16608    transportation_type 
   TABLE DATA           a   COPY public.transportation_type (id, name, slug, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    209   ��       �          0    16596    users 
   TABLE DATA           �   COPY public.users (id, first_name, last_name, username, email, ip, password, phone, token, active, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    207   *�       �          0    16785    users_roles_roles 
   TABLE DATA           =   COPY public.users_roles_roles (user_id, role_id) FROM stdin;
    public          postgres    false    240   F�       �          0    16584    waste 
   TABLE DATA           �   COPY public.waste (id, waste_type_id, waste_code, name, weight_unit, price_unit, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    205   x�       �          0    16573 
   waste_type 
   TABLE DATA           X   COPY public.waste_type (id, name, slug, created_at, updated_at, deleted_at) FROM stdin;
    public          postgres    false    203   ��                  0    0    activity_log_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.activity_log_id_seq', 718, true);
          public          postgres    false    238                       0    0    clients_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.clients_id_seq', 3, true);
          public          postgres    false    236            	           0    0    clients_waste_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.clients_waste_id_seq', 8, true);
          public          postgres    false    234            
           0    0    dashboard_orders_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.dashboard_orders_id_seq', 1, false);
          public          postgres    false    232                       0    0    driver_documents_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.driver_documents_id_seq', 8, true);
          public          postgres    false    228                       0    0    driver_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.driver_id_seq', 2, true);
          public          postgres    false    230                       0    0    generated_invoice_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.generated_invoice_id_seq', 1, false);
          public          postgres    false    226                       0    0    roles_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.roles_id_seq', 4, true);
          public          postgres    false    224                       0    0    submission_details_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.submission_details_id_seq', 21, true);
          public          postgres    false    220                       0    0    submission_documents_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.submission_documents_id_seq', 16, true);
          public          postgres    false    218                       0    0    submission_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.submission_id_seq', 25, true);
          public          postgres    false    222                       0    0    submission_status_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.submission_status_id_seq', 6, true);
          public          postgres    false    216                       0    0    transportation_documents_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.transportation_documents_id_seq', 1, false);
          public          postgres    false    212                       0    0    transportation_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.transportation_id_seq', 3, true);
          public          postgres    false    214                       0    0    transportation_license_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.transportation_license_id_seq', 1, true);
          public          postgres    false    210                       0    0    transportation_type_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.transportation_type_id_seq', 1, true);
          public          postgres    false    208                       0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 6, true);
          public          postgres    false    206                       0    0    waste_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.waste_id_seq', 2, true);
          public          postgres    false    204                       0    0    waste_type_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.waste_type_id_seq', 6, true);
          public          postgres    false    202            A           2606    16784 +   activity_log PK_067d761e2956b77b14e534fd6f1 
   CONSTRAINT     k   ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT "PK_067d761e2956b77b14e534fd6f1" PRIMARY KEY (id);
 W   ALTER TABLE ONLY public.activity_log DROP CONSTRAINT "PK_067d761e2956b77b14e534fd6f1";
       public            postgres    false    239            '           2606    16638 7   transportation_documents PK_163f9c66dd1f6317b3f0613df40 
   CONSTRAINT     w   ALTER TABLE ONLY public.transportation_documents
    ADD CONSTRAINT "PK_163f9c66dd1f6317b3f0613df40" PRIMARY KEY (id);
 c   ALTER TABLE ONLY public.transportation_documents DROP CONSTRAINT "PK_163f9c66dd1f6317b3f0613df40";
       public            postgres    false    213            +           2606    16660 0   submission_status PK_300aa8cbecff426e4d260870f9a 
   CONSTRAINT     p   ALTER TABLE ONLY public.submission_status
    ADD CONSTRAINT "PK_300aa8cbecff426e4d260870f9a" PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.submission_status DROP CONSTRAINT "PK_300aa8cbecff426e4d260870f9a";
       public            postgres    false    217            7           2606    16730 /   driver_documents PK_31c28b4e8f55a5d411597d45ab2 
   CONSTRAINT     o   ALTER TABLE ONLY public.driver_documents
    ADD CONSTRAINT "PK_31c28b4e8f55a5d411597d45ab2" PRIMARY KEY (id);
 [   ALTER TABLE ONLY public.driver_documents DROP CONSTRAINT "PK_31c28b4e8f55a5d411597d45ab2";
       public            postgres    false    229            -           2606    16671 3   submission_documents PK_34eb6af7ebe2caa65305f2483ca 
   CONSTRAINT     s   ALTER TABLE ONLY public.submission_documents
    ADD CONSTRAINT "PK_34eb6af7ebe2caa65305f2483ca" PRIMARY KEY (id);
 _   ALTER TABLE ONLY public.submission_documents DROP CONSTRAINT "PK_34eb6af7ebe2caa65305f2483ca";
       public            postgres    false    219            =           2606    16761 ,   clients_waste PK_4750fa7312bedc19164002fa38e 
   CONSTRAINT     l   ALTER TABLE ONLY public.clients_waste
    ADD CONSTRAINT "PK_4750fa7312bedc19164002fa38e" PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.clients_waste DROP CONSTRAINT "PK_4750fa7312bedc19164002fa38e";
       public            postgres    false    235            E           2606    16789 0   users_roles_roles PK_4f5382a23fff88b69c0767b700d 
   CONSTRAINT     ~   ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "PK_4f5382a23fff88b69c0767b700d" PRIMARY KEY (user_id, role_id);
 \   ALTER TABLE ONLY public.users_roles_roles DROP CONSTRAINT "PK_4f5382a23fff88b69c0767b700d";
       public            postgres    false    240    240                       2606    16581 )   waste_type PK_51796cc2eb029d2051b5809cf26 
   CONSTRAINT     i   ALTER TABLE ONLY public.waste_type
    ADD CONSTRAINT "PK_51796cc2eb029d2051b5809cf26" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.waste_type DROP CONSTRAINT "PK_51796cc2eb029d2051b5809cf26";
       public            postgres    false    203            #           2606    16616 2   transportation_type PK_548b7257f37afcaec0088bf98a7 
   CONSTRAINT     r   ALTER TABLE ONLY public.transportation_type
    ADD CONSTRAINT "PK_548b7257f37afcaec0088bf98a7" PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.transportation_type DROP CONSTRAINT "PK_548b7257f37afcaec0088bf98a7";
       public            postgres    false    209            %           2606    16627 5   transportation_license PK_60e2e90686796bc2147a5fee641 
   CONSTRAINT     u   ALTER TABLE ONLY public.transportation_license
    ADD CONSTRAINT "PK_60e2e90686796bc2147a5fee641" PRIMARY KEY (id);
 a   ALTER TABLE ONLY public.transportation_license DROP CONSTRAINT "PK_60e2e90686796bc2147a5fee641";
       public            postgres    false    211            9           2606    16741 %   driver PK_61de71a8d217d585ecd5ee3d065 
   CONSTRAINT     e   ALTER TABLE ONLY public.driver
    ADD CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY (id);
 Q   ALTER TABLE ONLY public.driver DROP CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065";
       public            postgres    false    231            /           2606    16683 1   submission_details PK_640eae23c7fc5437eed06ce88f2 
   CONSTRAINT     q   ALTER TABLE ONLY public.submission_details
    ADD CONSTRAINT "PK_640eae23c7fc5437eed06ce88f2" PRIMARY KEY (id);
 ]   ALTER TABLE ONLY public.submission_details DROP CONSTRAINT "PK_640eae23c7fc5437eed06ce88f2";
       public            postgres    false    221            1           2606    16697 )   submission PK_7faa571d0e4a7076e85890c9bd0 
   CONSTRAINT     i   ALTER TABLE ONLY public.submission
    ADD CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.submission DROP CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0";
       public            postgres    false    223            !           2606    16605 $   users PK_a3ffb1c0c8416b9fc6f907b7433 
   CONSTRAINT     d   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433";
       public            postgres    false    207            3           2606    16708 $   roles PK_c1433d71a4838793a49dcad46ab 
   CONSTRAINT     d   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.roles DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab";
       public            postgres    false    225            )           2606    16649 -   transportation PK_d7f91167cda8f3f83929b7892fb 
   CONSTRAINT     m   ALTER TABLE ONLY public.transportation
    ADD CONSTRAINT "PK_d7f91167cda8f3f83929b7892fb" PRIMARY KEY (id);
 Y   ALTER TABLE ONLY public.transportation DROP CONSTRAINT "PK_d7f91167cda8f3f83929b7892fb";
       public            postgres    false    215            ;           2606    16752 /   dashboard_orders PK_eca7603c651b3ee6c7694bc417a 
   CONSTRAINT     o   ALTER TABLE ONLY public.dashboard_orders
    ADD CONSTRAINT "PK_eca7603c651b3ee6c7694bc417a" PRIMARY KEY (id);
 [   ALTER TABLE ONLY public.dashboard_orders DROP CONSTRAINT "PK_eca7603c651b3ee6c7694bc417a";
       public            postgres    false    233            5           2606    16719 0   generated_invoice PK_ef7a9838a1068a05b090df23971 
   CONSTRAINT     p   ALTER TABLE ONLY public.generated_invoice
    ADD CONSTRAINT "PK_ef7a9838a1068a05b090df23971" PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.generated_invoice DROP CONSTRAINT "PK_ef7a9838a1068a05b090df23971";
       public            postgres    false    227            ?           2606    16773 &   clients PK_f1ab7cf3a5714dbc6bb4e1c28a4 
   CONSTRAINT     f   ALTER TABLE ONLY public.clients
    ADD CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.clients DROP CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4";
       public            postgres    false    237                       2606    16593 $   waste PK_f9168df990c4ee8a4c4b94724b1 
   CONSTRAINT     d   ALTER TABLE ONLY public.waste
    ADD CONSTRAINT "PK_f9168df990c4ee8a4c4b94724b1" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.waste DROP CONSTRAINT "PK_f9168df990c4ee8a4c4b94724b1";
       public            postgres    false    205            B           1259    16790    IDX_32e5adf0a2e33e130de343c6ee    INDEX     a   CREATE INDEX "IDX_32e5adf0a2e33e130de343c6ee" ON public.users_roles_roles USING btree (user_id);
 4   DROP INDEX public."IDX_32e5adf0a2e33e130de343c6ee";
       public            postgres    false    240            C           1259    16791    IDX_38703d4da3789a6ad8552ba783    INDEX     a   CREATE INDEX "IDX_38703d4da3789a6ad8552ba783" ON public.users_roles_roles USING btree (role_id);
 4   DROP INDEX public."IDX_38703d4da3789a6ad8552ba783";
       public            postgres    false    240            F           2606    16792 0   users_roles_roles FK_32e5adf0a2e33e130de343c6ee8    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "FK_32e5adf0a2e33e130de343c6ee8" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.users_roles_roles DROP CONSTRAINT "FK_32e5adf0a2e33e130de343c6ee8";
       public          postgres    false    240    2849    207            G           2606    16797 0   users_roles_roles FK_38703d4da3789a6ad8552ba783e    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "FK_38703d4da3789a6ad8552ba783e" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.users_roles_roles DROP CONSTRAINT "FK_38703d4da3789a6ad8552ba783e";
       public          postgres    false    225    240    2867            �      x�ݝM�]�q�ׅ_qggG���7P��#Eh�-�G�xs�,�e����h���ϛ��^�9]�>�Ъ�"U�8���47����������������������O�O篧ﾞ��|9?��~�t��o���n���������렗�������o��t��?�̢�<D�����ߟ�����w�q����\�.����������_����;���×o����o?���ج�����r~�_���_n��><�=���O��?���~��ӏ/Oϧ���N��O�/w7v����&������d���EٿQ��vYt
n�{�v��p����t���K'��'�M��E��ߞ�>����x�����������׻ϧ���_�����=��͟�O߿=>���=H�o�ы5{\ś�b6c��tvl�u�������Y���Kbӭs�o~������I���ͦ��U�?�?��{x�".k�=C��,7����7(� ���R��ʘ�?�?�>�pq0;h�g��X,C�_�z�����Y������ʕq����z�a�+��@���`oâML�<)��@�n�c�{\�(*jֻ[�Ov�+İ�T���ư�1���Ȯm"��.�2,~8����m���=��"2*j*ʭ:�ɣCވ��dv8F���`v�]E��=������/��?>~�)���-{\Y󧻇O��z�2FX��{\Yv� �I4��9�Ǖ��f�M:Ǎظ��j��:��á*�e��Q'�1L�++.��������Wn�����.ҹ�r1`W<X匐8�.К�Ǖ��f��N����rg�?_��Ùdi�}<?�O��z'/D����q弼A#�vn���v����v��,~�+���)���<��|k����q��Y� e
���{\a6
��V�V�)��\���zU=ͷ�M��4�[���u��"QS�ɰq�\y#Q���:W�
�d�վ�C����酹�+�e*J���+$jJ:-a�+l�jʈ�W>	���ۼ\aZ�����ˆ'�sOX��{��dk�WAX�m��8]p�E�vG���Ó
¢���zpqf���옺�>n�W�K�1U�-ݮ�`�:T�}�%oh��NX�Pm^/)�q�����C�{\a�l�ǫvas�są�.�����(.t0�n+����ʝ�{��ֻZ�)S���K�r��%	Vc�Ʌͷʋ�N������\�IE/k��9ꆚ���A��8������16��S�
Ca~�s��	������U'�v|1�0׹���؎?�b��U�'�[o�+n��$��.t!����dp��1Xk���iZyQI�El�u4���rkTvU�ӭ7:6N+*�z��Z�)���Ec�����jx���y?�9�^���jx��T�JR�&W��#@vn7�JEd�a���daWy�6V��"m�U�*Kʘ�_&�O\e�1)!�UE�.�%�s���%��9́l�P�����z���v�����:�� W9
:$���a�/��,� İ�	����sL5q����v*9���N�v
��q\q����v�Iq�0�ͺ��׸*����l�����n����\q���x���U�����bu��S窈��p���څ��ƍWE�%��E����W��I\��y�w�bpU�E�����u�^�E\���.lC�y�(qq��5��T�%.���0V[v��y�(A��Uek���
#�1fCT�4��ETc)���ʋ�(qa�wYg��;8D��#B��\fg�9}S��W����j�,�M	y�����v�L��\��9�kvmÖ���RJo�7v�C�}�+���!�E���i���y��M��V�A�]S��K��$/��2_W���i��)C�C'+Y)h-m�c_]�')a"��%jc���\Q�`�v��3[�V��)"n@�i���C���qP8@EO�~�X��)���0���a/8�15�_mw�ن[h\�ːP����Ȟ]p�i�?DK���^�E�C�Zû&�}�{�{�p~8�e�A��U�;�B)����#�C�ΡHrd�HQ�,���EF��y�ME�C��� �nr�fc6=��P�d��w�\������:�y�Pu9�
y����S�WN��{��}x�#�r�w�$:WTSK�.Oə�X�����#��bdqE������eE�2�+G���(9�={m�vy�y��!&)��0��t��x��gdQ.~��t�&�5�y�('I>d�+sQ��G|ap�Ǘ��Y�2��~�B�-�걔q�C��+���c��x�<'���
KUbw0�ɪ�ݬ�!��y�+z� OV��r�s{�!KT����D������~^�P�S��s�,�7zK%����!OTˑf~0�6ۖ��݂Q��9I*���<h�C��p$��!�����1�jB��w���\n�/95�ڄ�ˠ�������	�D���m���!+��$��x�y��`O⨀�ga�������H��7l�VN�Ĕ��ݼ�&��X$Q�G��\�(8�
�y����:ɱH��Ngi����x�ȳNOv��lq�ז��!���<�܆�c���d��.л��7z��~vb�ON�Skv8��$Z��ڻy�cLb�E���YvɳS�A�wr��f��їm/�X�w������,#��C�����:�a	d�s�����'��*<�"]��=vN_�<x5S���[9}yR�K�
|a&1o�8��'��	d��w{�d��P>*=ֱ�-	+'�)鼤Y�t�̓��Vw^R�7���^pe���"��u�G>�}�>}�{�x~<,�n�]?�`����PN�N��p�^Yp葩LZؗչ�u[�h�[��v8�	B�+kn��׼w�01���>,��_��\Q�Tq��t�[U9de�.*��Ƽ��q�X[�jp�4̯��)1�Շ��|��%2�S���4�"q� ���K���!Kn�6��l|X�C��Fo��Q)��q�Qa}����pCL�SO�&G���]Uoܩ��0?���R��"S��cS�se�7��-+��IX9d�q�~dYE{?������m�e�o+��qp|[odvX��m�h���Ȳ�v|��޸�:����:Wvy�6�زR�����7�I,�ͱ���5;��'�Q^؉���Nm��F��*��P�C��W��J�[�"e����@������12s�r��3�nK��#[��+w�5+lg�y�:'i�%��2�b�C�����6쨺s�O���_�/|�:WT�^��'Y^6���"��̧��i^�����/�>���<�H��ɸ9�ҊDi�*�X���{�W�a��jJ���d<[Ei�=b�@Դ���fy�fy�q�;ѓ�Ս�����@5Y^�� 	Q���}UN#&��G����@ꕓ�(�-w�Ae����ą��D]��8dI=�k3JJ���PW��V�z�B��ʺE���uY�G�9��9��|��)�ոs葓�(J��i7Ϸ��GjNF�V�����`,��a�
����=����Ɉ�mm�8�-'��I���bJ�xŊ��m�܉��ZZ�2���]:1ON��I��5������[7.����~���yc6i"�v>h�lLG��d��*��|(z�!Nd8�D�z���'�8}q2�Vt|h4�1��p��0T� '��ly��HSQR�?���x��9�W]�e/�Kin^�̕�0Rq7�p刺��4��:[�W�����,i:TL���9���2P]�-��C���,��T[R�Y�bE��DFΡv�I��~W�(+��i3���ˣ+N�0�D#����iQ�4C��sD98�ɺ�i����/ϑd��>��	�xޚi��P�[*i���+��@����۝#n����9*U��Z�&������|:��q�#��rA�����K�;kXu�cE:�I��p�%2�h��=i�z�4�c��؈��FL\�AO��"��Z�WTwJ�*xc��,�U:�S�s4�D�1���1,�:�y��"���_t0s�18d�|�RUXW�X��rzV��d~�&�qpȒ    �{:$l"���s�z*���ǕM"O: ��z��l��d
s�\(�{�D�uԮ���8�uN�sI޻�vf�6緹��,�݋[[3Z���F�q�TrU�T҈%�t�m5�4+TZ}�mܼ�i"o[����i��;'iB��P�\�%�sr!����� ���"�α�e�1IH:z6b�++�Ri3?�i�ekY��~�����2������.����l���QU�g<"����|,Y����X� ������@:�0����k����t�R�;Ib3rpE5N�}hd��1͑~����7/0?P��y=\Q_s�s1����!-}����!���tk�^��N��"���������!S�Ȯa�,q����²2�,�D�f���C��S��f7����&������+��o~�x��ݣ�/����tx����\�|l���`���r�{YD��nv0��1;�,�;,�z�"���P4�n�/4Y"/Uj[�%��+�$�N8�i5n�������,˾��H�Zz1��S�WN�1�m����[�Y9�#�T����#�ΕVʹ��(i)n�CV��Gi�6�"G�1�����4^,Fǎ��T�Eg7/ƃC�e/����yc[�9��s,���y3�9�]��|�|Xe�r�J�����,r�^�-,�r�<g�n��i v8T%�ӏ7�y��-�d��Kb~b��=�"q�!j5[U��9IE��o����8�7
��[�����y�88tYA�D=���RCb�����C���g���QOAC��2������3Z(Q�f��X9�9Q]U��^[����duU������<VNN\V��f}��.z6X+/�%�W�0���/�s���f {Xe�|�	̣weF��ev�����C�E��u`t�1��[�5�(�F�wd]	�$�,:�./j�٢�:�� o�m�����k�duQ懍���!KbT��9e����,�aE���\�C�İ�^�~0ѹrAV��a>����q�2�dم��2��ʍ�,Yݿ�����Y3;��[�7�<,�Sۃ9윾-A���@Y6�V�e8�.�z�M�7����Z�@�²N;����m�a��[C'��yY���A9�0�"�sT18�y�T�������E�G$ ml��2AGdv����bD�J�|�+,l��������y�ΡLR<iC�͖�X{��ax��ŗ�����{�vXU�:M����Ρ*	�w��7�a�S琓o~������I����t�CO5<��¶+�����㩩.[�:WԢe����:�(,��||98�YY�6|���zF�1Y������8d��b��/ג�M��Ջy+�;�4O*lS�9�EI_Vn�[p'9I��������9���;�z�X����VdM@Z��&`���e7,?�0���t���aj�x��9��ו��p��t'D�ז��uN�p����n��%����E�����*�x*]M�]���!���C�RLP���J�;LAӕ"a�����2��	+���^��b�r:,���P�o������鏏EdI�vD����M����O�����qg���QAK,=}����,D�Ӊ�M��_~�� DO�ys�*�[��H����Lw:{j�^V���_��Bu�,����'k�U��i��P�L;X��Y��8V�2��H�5K�����<��58�y�48D���yXQ�k�.�;'Q�����Bֆm�;��/�AV�D�b����A�P5(�n�W�|Q� U�#�w�C�kM�j?=|Dw�糌�z�`�3��o�d��j��,O:N%).8�J�R6�MF�~jiv�!/
?I�j<u1�{*�N�q��%J���Pʊa����%�r�+�Θ���h?%�r� fs����[z*W��&슲�?7<���%��E�W�G��q��{��Ou�f�08d������kQ��3p�*=8t��+)��\�(Q��gI��N�$�T�p����Еe��Y��ƫs蒓�AEk�	O��j�9��.�aj8�h�%�r�e�,�0�av1/18�+�]ͧ��٧wQ��#v0?$M}5w8tI-B�������:�,��Z�b��XT��^p�XDjh����������X�-��p���"�`�Y����Wޱ�RN���`�2='���g�45˝�r&_1\���Ȅ^	Ӟ޻��=��4��QtYb�r6��Nnv�C��F�����>��!Kb|A/1����k�$��D�hϽy��%��"ҳY�]E��B%�#�չ��%:�Hs�QX���������,�:,�J<8��҄]��5��7�i{�*+;�F썧%Gf��X6d�C�ۯI�,�R�f���(�uXz��햢ʡ(�t��F.�'vaY�P9��1T�C��;�f��Tl�+�ݑ4����|B88d��#�f{�\�1J�qW$�zUޡqE[�����h�C��;�HOQ��Ӕ�z��+ݍ8*cI��v8�	)��R�RT9�t?�8Qd�����j� yzAH[oI�\����ٰ�b�P&�f��
[�:W>.��/8y땷��C����!��$��PG)�iv�C��	�l�_o��bpE�Ndu3�և�=;���JL�2����Lb��s$iM˪�TBz��C�����꨽���!GN��fw�%�����S��!@6�,��X���
�axX�eg�C�US���ta�y�4JVLM�fwBX7_Q=NT ��v���s�ɋ�/�����;�� j�`�]�����(P��C�8%�d�����mE$-U����nCQ�PTĝ$�����q��"��-8�������f�^��zz�����6\&��@pp(r�.Gμ������a9�0ꏬs`�s�& �0�&�Q��P��D��'���rhJ��!VۭՎ�*MYL5�f7v��񭜾�"p����J�+_y����̕wM�b����ݞ���J�3���%m��ơ���cyz`o�cuE�N.�喝\E^ںKuR���P$,���c����w$.����� ����)LZ}!��Mb�X�K� �ڍ;#
{���b������ӽ��
*2�_��E�Wa��Q�,�ԙq�+zO!�0��H:٭#N�$W4˩�\��P�D��j�5:�M�C���3�X�s�MA�8��CS��7	��^pH�u`QmwԤmc
6M�چ4��-M�CS�Z5����'���`�E���,��q(2Y�ƨs(��b�춬���q�D�%*65�/7^�Am�;�<��\p�	��&؞�5[�Q����]hh�<�:�9��4�Vۢ��w-Y����.h�y��16�FN��f��1��i�ce]q4ӽ�qk��#N���1��eJ\ph�5E���:849a�R��A{\��I��J�SG�ye������^�r*��(k�9���c���'��
t��lx�ơ)�<"	�%��rr�E��{U,�V��*8Y���7�c�P$�СY����C��[�<j�N��"i�d;��i#�m��P7��FzaaҊ!,~�R�����ͯn�Iz��-�Wj�CQ�(���i��(�d�϶�`�'��X����o��
^N?�j6�"�{���G\?�f>��y�!K�)E����á����-����uE^�(y�M�����K�������D]n�g��s葖���;�Ρ)�MT�
�}?��$����Ρ(;����[ݎ�$��;�@��K�X��&+֧[��,�jpHT8j��1�"/xCh_�\`��woj��f�-6�Q� Fz3O�w8�Z2dXZ������k*�Nak�*�:V	K�,cua����wA��E�G�P(��Z�X����6���1�"q7'��R�MRoN"U
��bB�թ�ә)[1�	�1��~m�9	�1����@����� ۃ�yk���C/B]E�7=���*$��E���vc��Ba�E�ܦmE�P$,������q(_$�*�)N+�"��E��a���sH{;3��i-l��;��TC�?ޝ���������Gs~�x>=���?���,4S�� &  6[;�?@���X��;�?@������u�f�P�e��j9_�W=®f���m���U�b;�7��p'�9��ɹ6z�)�C���Ly��G��C����T��.<��s��3��Kc�\�9d)�a��ֱj}�����v<�e�����sU�:���C������=ߕvEE^i�&����WAXy�D����C��.��p�6�^���䢸��im#����0Y dy����?��D���i��K��ث.�ܑ�Ct"y�"��e�w�=�E�em/�Ů8b�r�N$���ƀ5y��s����/_n�.�#gx�S�w)
�2��
�x�ʞ��C��Pt�^�����+n!��?_�����R�Pt��wiBq�����t�;��Hs;<C�A
{�GS���_�94�	-���M��į+N�$3��2���e��ky{	��T�[6-;���KU��j
Uh��9��U4���x�BO�*;����N=ٱ��s(:Dv�;]]�]q|Q�g�Q���Ƥk��4�]������c=�}�0l�>���d9�Cҟ���ò�����t��^��D[?T���|Ĭ��(���Zt�P��Y��U��k��=^ƻ�%����C\��|E�ްE�uE)��.MN�e�/�&Y�YNy�[�T9�_>��]z2%��q�	��"y��Z�a������>{�&�7��qh:V��HsSǟki�ȹx�"*��5X�+zW)胲u
l�:W��~׻��´b�9N��w��:�8uY�ϝ{�k��̉w9Nޕ���w��+
��;�i�n��V� �=Tߥ�.6�q(�B/��#�}Uc�C�!���K�Չoz;�"VT���s`�/�CV��[�Ͼ��U������	��0
�Q�c$�F�^������I�4<��Ӯ�Q_sE������Q��ڳ���!L�Q��G��%�=�"j��Tؚ�9d��&��qD��i���P(,���'u��с<Eya[�Ρ��t�?�츥s�"k�(lc��9��*j�dX۹���@e��شoS����x�]�b�9�"�2d!�l�:�� ��%�#>�Y�9����$�<ܖ��e�=r��O��2�9�	,b�'p,TZ9)���IV#(_��T�b\�p/4+��*��#~��9T9c�k�lb��+*[Q������?���B���/R�g[�_n~O���������T��������t�|�����g��ӗ����3��;,��i,���ç�?�t~~9}~y|�������K�����ו�>}9�
������������I�M93O�9���T/\�����Ρ���µ���[�*Wq�,*�/����+���^A�(�m��sEo.���Uam�c�?��R����W�CW�4�<>��!;��r���]u�<*/�4Ֆ��*�b����oB��Dv?8���u����*�g����*�"�e�+���HVN),�F�e����u^y��t�*�C���X���Jqp(�*��.a���5��$�M��t|��wL뜬����&�\���(�]��fg�c��"�㊷s,1?ع����E,��]tEV�P�ۅ��	����BY�{pE�W%g!�B����tN
�T��{�\ѻQ����L���P�]j�Vh2m͹ʡ'˻Ԇ�~ё��Y��MavHz�,��\��ʐ��=����,#�R�������!MVU/OO��a��+��(yg%�_��cp(�u��k���~E�.�r�z3{���H��Po	V kp{�r��ް>�[���'�u,Y��+lvE�-`�)��bu��r�R���D�|384��IBљ�i��w��s�U�*�x�껣���΃��&��꣉̗�ΡͿ��-/P�v��1}pA��Ui>��ʢ�q�ɶ���+'yI��ծ�{|:8�e�CW�>����[�+���g��*WɈ�Kj;K^�rpE]9�i�ˇ�Ʃsh��J!�vz|�n��&Y�(��>�����顬�ec�5EҊ��v�Ne8W�!IZ�/�ZK��уC����d{О��+z)(�S*tt�=�v����J�����      �   �   x�u�A
�0��+��Y�c[��|1���B���hJ ��2����x~���m�v``b��LL��Q0�Q2��8>��«����œ'�EӕgӂB�ʋ����?��582��ӏ>���̨z��ʊι/��5      �   c   x��λ� E�ڞ�����!2��BCE��zG���+���yd��=X�+��K/0����~6��C{� �[^�m���-;����MI¡Vɽ]����U+s      �      x������ � �      �   y   x�����0Dg�+��Z��I��c$`a��Ru(#�����������t�Ј@��ѹ���!�Q�:h�)*������S5�n���ral��z;Ğ{ �گs��f���i�"���p(�      �   #  x���Mn�0������3��2�	"!�qC0¦Uo_���*��G^<k��y#	�k� �|p=�j&_-���jRj��͍)V��_�\A5S� S�ԝ�B�i��b-�5�!hL��R?KLs�|it���wc�2����7ڻa��a�V��yz"�#A��2K����s(��]�B�y�����ie@J&�R5�����ւ1tН�=���Z)t{g� ��g,��P�Kϰ��=������ů쥴V��+�*�2�z�Ϗ���_����["(7y8�V�SY�;�e��      �      x������ � �      �   p   x�3�.-H-RpL����,���l##]K]CsCK+c3+#c=CK\�\F��E�yɉy��y�HlRM2��jO,���K���Gb�j�	�KfQjvq&g
�&Մ=... �9F�      �   �   x����i1D��*���H�l�����
�?�C�s6�4H���s���Q>0��q@o�R5��ɍB��-�Qx�2���!��07lq9�S��b7{�7�+p��c3Fb�:�</�5�Q�Za?f��߄3y���+�������W.��g)��f�����Gz�a�ۮ�vQ��ƟDG�,b�����Mb��Tk��9n|      �   �   x���Mj1���)�1��<�!z�lJH`H�}5iJf\��zH�
��1��8����t�n�0����j��
W�h�v��[ ~r6m�$A8�K��?�ܒT�8�O�J�q��=VWB�P�N�r��"���[�.d%�[I��"�T�l��^'G�j�4ztUB�՗T���z�k��ϗ��z#�P�����i���q�(/18M����*W��<��N8��7�z�      �   -  x����n�@��3</ ����&�1R5Fo&���Qذ�}�
izh� z��~�o��1�^*�i��L� �Up��&+���L}���&0��TS5u <�DD�H�aIQ�C!!�����TQ�	��w�	��%33��d�V.�����R��i� �)	�$ެ����l��n�ܿy/�u��/��>�Wso��x���(�ZČs_N��]�İ#�6��nZ;J)y\)a��=�u̯�XL[TXi;��� �7�o��W�C�g�č~}I���g�ӢQ�N4�J��+	�@�7?���~n*�      �   k   x�3�H�KO�*M��,��b���8��S��9�4PИ3<1�$3/]! 39����/�p�JL8�R!S��Ԝ���L�b(4�t�LJ,I��ڗ�`�b���� h�1�      �   �   x�u��
�0�s�}��4i�����̓���&�����Oo+� �?�/Ѡ���㽕���ﰗ�X�3 $�`���óϰ�%���2�Q��+8�%�xk�r�r�&��<�����OWKdgٱU���yt9��~:���Oy�Hlt�Nc���cr�**�w��q|�T��8,�Q�R��^E?W      �      x������ � �      �   �   x���K��0�5�� ���=A%dB��Ѐ(��j������,�  ]���.���
�� �e����mϘ���Vίe^7ކ9K����蕳ǖV%�AwQ9�(b�u	���hĸ��<u�C��g�yJ�1�@�R"Dtl,1(`��A�%xU����C5�<r�WK\�i���ym*��'��c��xw����1�M�1�1u�g}�6�G������u�+��oӐo�䩸]˛(�����      �   <   x�3�t)�-P)*M��L2�K�L##]K]CsCK+c3+#s=Cs��1~\1z\\\ g��      �     x�u�Is�0��3~��6�NU�
.��x	�6Z�����6]^���g��o�@�D,f�9OrA���LÜ��N���*�U���CeE� t��2Bsҏ%��&-щ��\�Vcc3�|'M�V�<�y�gX���e�����t�	�0c�ƔƧYg[��n�l9�f9�����]��ȶ= ���t���a�<s?��kB�ݝ6L[~Ȕ T�1/���W�y���%1��f&?��vk�u�O;�����4Y�o7���.o3����rG�G��L���|D�+���`��ಿ�-6n�3}���5x���2}�xˌ�I�q�����fV�$����S�D�t�~�IW�C#�~|��y�ėeD�'��Q)V8m$�ɦf'�e|df�'��ۻ����m`�%�*s%�S$���A"�$��$$+�{��	�D��OQExXp!(�y�q�r�:������deǽdn���A/K�R�D��V���Ō/]pP��V�	�R4X�I��:�R�|���      �   "   x�3�4�2�4�2�4�2�4�2�f@���� 5&�      �   m   x�]�A
�@D�u�)��Mu9Ό}���U@�E D��"$�}|��]�iۏ��/�L-��hP���q� �� ͽ�xS����/������,�g�.[�+�pؐ����o�� K      �   �   x��̻�0�}�� ��¨�D]�H�A4b5�����t:�ᓬ2����86��\���FI�\Ȣ�Y��Xn�߿>rE�ޤ���4q'�Ú;��u�)�LN\F؞�n~��?�����́�mG ��
��E[3 �c����y@     