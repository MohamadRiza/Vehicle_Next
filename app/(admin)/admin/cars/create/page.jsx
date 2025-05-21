import React from 'react'
import AddCarForm from '../_components/add-car-form'

export const metadata =  {
    title: "Add New Car || Vehicle Admin",
    description: "Add a new car to the marketplace",
}

const AddCarPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Cars</h1>
      <AddCarForm/>
    </div>
  )
}

export default AddCarPage
