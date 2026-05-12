export const provinces = [
  { id: 1, name: 'กรุงเทพมหานคร' },
  { id: 2, name: 'เชียงใหม่' },
  { id: 3, name: 'ภูเก็ต' },
  { id: 4, name: 'ขอนแก่น' },
  { id: 5, name: 'นครราชสีมา' },
]

// cities = อำเภอ/เขต (cascade จาก province)
export const cities = [
  { id: 1, province_id: 1, name: 'เขตจตุจักร' },
  { id: 2, province_id: 1, name: 'เขตลาดพร้าว' },
  { id: 3, province_id: 1, name: 'เขตบางรัก' },
  { id: 4, province_id: 1, name: 'เขตวัฒนา' },
  { id: 5, province_id: 2, name: 'อำเภอเมืองเชียงใหม่' },
  { id: 6, province_id: 3, name: 'อำเภอเมืองภูเก็ต' },
]

// districts = ตำบล/แขวง (cascade จาก city)
export const districts = [
  { id: 1,  city_id: 1, name: 'แขวงจตุจักร' },
  { id: 2,  city_id: 1, name: 'แขวงจอมพล' },
  { id: 3,  city_id: 2, name: 'แขวงลาดพร้าว' },
  { id: 4,  city_id: 2, name: 'แขวงจรเข้บัว' },
  { id: 5,  city_id: 3, name: 'แขวงบางรัก' },
  { id: 6,  city_id: 3, name: 'แขวงสีลม' },
  { id: 7,  city_id: 4, name: 'แขวงคลองเตยเหนือ' },
  { id: 8,  city_id: 4, name: 'แขวงคลองตัน' },
  { id: 9,  city_id: 5, name: 'ตำบลสุเทพ' },
  { id: 10, city_id: 6, name: 'ตำบลตลาดใหญ่' },
]

export const deliveryProviders = [
  { id: 1, code: 'KERRY',    name: 'Kerry Express',  logo_url: '', is_active: true },
  { id: 2, code: 'FLASH',    name: 'Flash Express',  logo_url: '', is_active: true },
  { id: 3, code: 'THAIPOST', name: 'ไปรษณีย์ไทย',   logo_url: '', is_active: true },
  { id: 4, code: 'J&T',      name: 'J&T Express',    logo_url: '', is_active: false },
]

export const companies = [
  {
    id: 1,
    name: 'ร้านยา MedCare',
    tax_id: '0105565012345',
    license_number: 'ร.อ. 123/2568',
    telepharmacy_mode: 'ep',
    address: {
      address1: '123 ถนนพหลโยธิน',
      address2: '',
      province_id: 1,
      city_id: 1,
      district_id: 1,
      zipcode: '10900',
    },
    line_credential: {
      line_channel_id: '2001234567',
      line_channel_secret: 'abc123secret456def',
      line_channel_access_token: 'eyJhbGciOiJIUzI1NiJ9.xxxxxxxxxxx',
      liff_id: '2001234567-AbCdEfGh',
    },
    delivery_credentials: [
      {
        id: 1,
        provider_code: 'KERRY',
        scope: 'company',
        branch_id: null,
        api_key_enc: 'kerry-api-key-encrypted',
        api_secret_enc: 'kerry-secret-encrypted',
        api_endpoint: 'https://api.kerryexpress.com/v3',
        merchant_id: 'KERRY-MERCHANT-001',
        additional_config: {},
        is_active: true,
      }
    ],
    created_at: '2024-01-15T09:00:00Z',
  },
  {
    id: 2,
    name: 'ร้านยา PharmaCare Chain',
    tax_id: '0105566098765',
    license_number: 'ร.อ. 456/2568',
    telepharmacy_mode: 'pos',
    address: {
      address1: '456 ถนนสุขุมวิท',
      address2: 'ชั้น 2',
      province_id: 1,
      city_id: 4,
      district_id: 7,
      zipcode: '10110',
    },
    line_credential: {
      line_channel_id: '2009876543',
      line_channel_secret: 'xyz789secret',
      line_channel_access_token: 'eyJhbGciOiJIUzI1NiJ9.yyyyyyyyyyy',
      liff_id: '2009876543-XyZwAbCd',
    },
    delivery_credentials: [],
    created_at: '2024-03-20T10:00:00Z',
  }
]

export const branches = [
  {
    id: 1,
    company_id: 1,
    name: 'สาขาลาดพร้าว',
    reference_code: 'MED-LPR-001',
    phone_no: '02-123-4567',
    latitude: 13.8015,
    longitude: 100.5641,
    address: {
      address1: '789 ถนนลาดพร้าว',
      address2: '',
      province_id: 1,
      city_id: 2,
      district_id: 3,
      zipcode: '10230',
    },
    created_at: '2024-01-16T09:00:00Z',
  },
  {
    id: 2,
    company_id: 1,
    name: 'สาขาสยาม',
    reference_code: 'MED-SIAM-002',
    phone_no: '02-234-5678',
    latitude: 13.7455,
    longitude: 100.5340,
    address: {
      address1: '10 สยามสแควร์ ซอย 3',
      address2: '',
      province_id: 1,
      city_id: 3,
      district_id: 5,
      zipcode: '10330',
    },
    created_at: '2024-02-01T09:00:00Z',
  },
  {
    id: 3,
    company_id: 2,
    name: 'สาขาอโศก',
    reference_code: 'PCA-ASK-001',
    phone_no: '02-345-6789',
    latitude: 13.7385,
    longitude: 100.5608,
    address: {
      address1: '200 ถนนสุขุมวิท ซอย 21',
      address2: '',
      province_id: 1,
      city_id: 4,
      district_id: 7,
      zipcode: '10110',
    },
    created_at: '2024-03-21T09:00:00Z',
  }
]

export const employees = [
  {
    id: 1, company_id: 1, branch_id: 1,
    first_name: 'สมชาย', last_name: 'ใจดี',
    email: 'somchai@medcare.co.th', phone_number: '081-234-5678',
    is_pharmacist: true, license_number: 'ภก. 12345', avatar: '', enabled: true,
  },
  {
    id: 2, company_id: 1, branch_id: 1,
    first_name: 'สมหญิง', last_name: 'รักดี',
    email: 'somying@medcare.co.th', phone_number: '082-345-6789',
    is_pharmacist: false, license_number: '', avatar: '', enabled: true,
  },
  {
    id: 3, company_id: 1, branch_id: 2,
    first_name: 'วิภา', last_name: 'สุขสันต์',
    email: 'wipa@medcare.co.th', phone_number: '083-456-7890',
    is_pharmacist: true, license_number: 'ภก. 67890', avatar: '', enabled: true,
  },
  {
    id: 4, company_id: 2, branch_id: 3,
    first_name: 'ธนา', last_name: 'มีสุข',
    email: 'thana@pharmacare.co.th', phone_number: '084-567-8901',
    is_pharmacist: true, license_number: 'ภก. 54321', avatar: '', enabled: false,
  },
]
