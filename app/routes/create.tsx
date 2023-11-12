import { ActionFunction, json } from '@remix-run/node';
import { db } from '~/services/index';
import { redirect } from "@remix-run/node";
import { contactSchema } from '~/schema/contactSchema';
import { useActionData } from '@remix-run/react';
import { ActionData } from '~/interfaces/interfaces';
import { Errors } from '~/interfaces/interfaces';

/**
 * Action function to handle creation of a new contact.
 */
/**
 * Parses validation errors from Zod.
 */
export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const parsedData = Object.fromEntries(formData.entries());

    const result = contactSchema.safeParse(parsedData);

    if (!result.success) {
        const errors = result.error.errors.reduce((acc: {[key: string]: string}, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
        }, {});

        return json({ errors, formData: parsedData }, { status: 400 });
    } else {
        const { name, email, phoneNumber, address } = result.data;
        await db.contacts.create({
            data: {
                name,
                email,
                phoneNumber: Number(phoneNumber),
                address
            }
        });
    }
    return redirect('../index');
}


/**
 * Creates a new contact in the database.
 */

export default function Create() {
    const actionData: ActionData | undefined = useActionData();

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
                 {actionData?.errors?.name && <p className="error-message">{actionData.errors.name}</p >}
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
                 {actionData?.errors?.email && <p className="error-message">{actionData.errors.email}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                <input
                    name='phoneNumber'
                    id='phoneNumber'
                    type="number"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {actionData?.errors?.phoneNumber && <p className="error-message">{actionData.errors.phoneNumber}</p>}
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