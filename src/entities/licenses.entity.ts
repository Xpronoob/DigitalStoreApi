export interface LicenseEntity {
  order_item_id: number
  license_key: string
  issued_at?: string
  active: boolean
}

export interface LicenseEntityOptional {
  order_item_id?: number
  license_key?: string
  issued_at?: string
  active?: boolean
}
