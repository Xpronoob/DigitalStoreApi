export interface PaymentsPaypalEntity {
  payment_id?: number
  order_id?: number
  payment_method: string // 'paypal
  payment_paypal_id: string
  payment_capture_id: string
  payment_payer_id: string
  payment_email_address: string
  payment_first_name: string
  payment_last_name: string
  address_line_1: string
  address_line_2?: string
  admin_area_1?: string
  admin_area_2?: string
  postal_code: string
  country: string
  total_amount: number
  payment_fee: number
  net_amount: number
  payment_status: string
  payment_date: string | Date
}

export type PaymentsPaypalEntityOptional = Partial<PaymentsPaypalEntity>
