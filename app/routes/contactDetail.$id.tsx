import { useLoaderData, Form } from '@remix-run/react';
import { db } from '~/services/index';
import { Link } from '@remix-run/react';
import { contactSchema } from './create';
import { redirect } from '@remix-run/node';


interface contact {
    id: number;
    name: string;
    email: string;
    phone_number: number;
    address: string;
}

interface LoaderParams {
    id: number;
}

export async function loader({ params }: { params: LoaderParams }) {
    const { id } = params;
    const contact = await db.contacts.findUnique({
        where: {
            id: Number(id) }
    });
    return contact;
}

export async function action({ request, params }: { request: Request, params: LoaderParams }) {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const phone_number = formData.get('phone_number');
    const address = formData.get('address');

    const parsedData = Object.fromEntries(formData.entries());

    const result = contactSchema.safeParse(parsedData);
    console.log(result);
    console.log(parsedData);

    if (!result.success) {
        console.log('Cant do this');
    } else {
        await db.contacts.update({
            where: { id: Number(params.id) },
            data: {
                name: String(name),
                email: String(email),
                phone_number: Number(phone_number),
                address: String(address)
            },
        });
    }
    return redirect('../index');
}




export default function ContactDetails() {
    const contact = useLoaderData<contact>();

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-xl mx-auto bg-white rounded shadow">
                <h1 className="text-2xl font-bold text-center mb-6">Edit Contact Details</h1>
                <Form method="post" className="px-4 py-2">
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" defaultValue={contact.name} required />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" defaultValue={contact.email} required />
                    </div>
                    <div>
                        <label htmlFor="phone_number">Phone:</label>
                        <input type="tel" id="phone_number" name="phone_number" defaultValue={contact.phone_number} required />
                    </div>
                    <div>
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" defaultValue={contact.address} required />
                    </div>
                    <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Update
                    </button>
                </Form>

                <form method="POST" action={`../deleteContact/${contact.id}`}>
                    <div className="container mx-auto p-4">
                        <Link to={`/deleteContact/${contact.id}`}>
                            <button>View Details</button>
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