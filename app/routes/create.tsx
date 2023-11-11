import { Form } from "@remix-run/react";
import { z } from 'zod';
import { ActionFunction } from '@remix-run/node';
import { db } from '~/services/index';
import { redirect } from "@remix-run/node";

export const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone_number: z.string().min(1),
    address: z.string().optional(),
});

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const parsedData = Object.fromEntries(formData.entries());

    const result = contactSchema.safeParse(parsedData);
    
    console.log(result);

    if (!result.success) {
        console.log(result.error);
        throw new Response('Not allowed', {
            status: 400, statusText: 'Not allowed' });
    } else {
        const { name, email, phone_number, address } = result.data;
        await db.contacts.create({
            data: {
                name,
                email,
                phone_number: Number(phone_number),
                address
            }
        });
    }
    
    return redirect('~/routes/index.tsx');
}
    

export default function Create() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Create Contact</h1>
            <form method="POST" className="w-full max-w-lg mx-auto">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                    <input
                        name='name'
                        id='name'
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        name='email'
                        id='email'
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone_number" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                    <input
                        name='phone_number'
                        id='phone_number'
                        type="number"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                    <input
                        name='address'
                        id='address'
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Submit
                </button>
            </form>
        </div>
    );
}