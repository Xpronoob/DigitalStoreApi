export interface PaypalEntity {
  body?: {
    intent?: string
    purchaseUnits?: [
      {
        referenceId?: string
        amount?: PaypalAmountEntity
        items?: PaypalItemsEntity[]
      },
    ]
  }
  prefer?: string
}

export interface PaypalAmountEntity {
  currencyCode?: string
  value?: string
  breakdown?: {
    itemTotal?: {
      currencyCode?: string
      value?: string
    }
    shipping?: {
      currencyCode?: string
      value?: string
    }
    handling?: {
      currencyCode?: string
      value?: string
    }
    taxTotal?: {
      currencyCode?: string
      value?: string
    }
  }
}

export interface PaypalItemsEntity {
  name?: string
  quantity?: string
  description?: string
  unitAmount?: {
    currencyCode?: string
    value?: string
  }
  tax?: {
    currencyCode?: string
    value?: string
  }
}
