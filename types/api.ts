export type TypeCategory = 'Accessories' | 'Clothing' | 'Food' | 'Misc'
export type TypeSubCategory = | 'Kids' | 'Adult' | 'Male' | 'Female'| 'Mobile' | 'Desktop' | 'Laptop' | 'Variety'
interface Category {
  category: TypeCategory;
  subcategory: TypeSubCategory;
}
export interface TypeProduct {
    name: string
    amount: string
    rating: Number
    category : Category
    tags: Array<string>
    photo: string
    model: string
    brand: string
    manufacturer: string
    tags : Array<string>
    product_id: string
    variants: Array<Object>
    description: string
    discount: string
    release: Date;
    expire: Date;
    addedDate: Date;
}

