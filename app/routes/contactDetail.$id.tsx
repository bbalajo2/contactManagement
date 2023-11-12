import { useLoaderData, Form, useActionData } from '@remix-run/react';
import { db } from '~/services/index';
import { Link } from '@remix-run/react';
import { contactSchema } from '~/schema/contactSchema';
import { json, redirect } from '@remix-run/node';
import { contact, ActionData, LoaderParams } from '~/interfaces/interfaces';

/**
 * Loader function to fetch contact details.
 */
export async function loader({ params }: { params: LoaderParams }) {
    const { id } = params;
    const contact = await db.contacts.findUnique({
        where: { id: Number(id) }
    });
    return contact;
}

/**
 * Action function to handle contact update.
 */

export async function action({ request, params }: { request: Request, params: LoaderParams }) {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const phoneNumber = formData.get('phoneNumber');
    const address = formData.get('address');

    const parsedData = Object.fromEntries(formData.entries());

    const result = contactSchema.safeParse(parsedData);
    console.log(result);
    console.log(parsedData);

    if (!result.success) {
        const errors = result.error.errors.reduce((acc: {[key: string]: string}, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
        }, {});

        return json({ errors, formData: parsedData }, { status: 400 });
    } else {
        await db.contacts.update({
            where: { id: Number(params.id) },
            data: {
                name: String(name),
                email: String(email),
                phoneNumber: Number(phoneNumber),
                address: String(address)
            },
        });
    }
    return redirect('../index');
}

/**
 * Form for editing contact details.
 */

export default function ContactDetails() {
    const contact = useLoaderData<contact>();
    const actionData: ActionData | undefined = useActionData();

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-xl mx-auto bg-white rounded shadow">
                <h1 className="text-2xl font-bold text-center mb-6">Edit Contact Details</h1>
                <Form method="post" className="px-4 py-2">
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" defaultValue={contact.name} required />
                        {actionData?.errors?.name && <p className="error-message">{actionData.errors.name}</p >}
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" defaultValue={contact.email} required />
                        {actionData?.errors?.email && <p className="error-message">{actionData.errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Phone:</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" defaultValue={contact.phoneNumber} required />
                        {actionData?.errors?.phoneNumber && <p className="error-message">{actionData.errors.phoneNumber}</p>}
                    </div>
                    <div>
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" defaultValue={contact.address} />
                    </div>
                    <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Update
                    </button>
                </Form>

                <form method="POST" action={`../deleteContact/${contact.id}`}>
                    <div className="container mx-auto p-4">
                        <Link to={`/deleteContact/${contact.id}`}>
                            <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Delete
                                </button>
                        </Link>
                    </div>
                </form>


                <div className="container mx-auto p-4">
                    <Link to="../index" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Go Back
                    </Link>
                </div>
            </div>
        </div>
    );
}