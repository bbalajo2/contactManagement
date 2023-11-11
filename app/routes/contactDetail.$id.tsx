import { useLoaderData } from '@remix-run/react';
import { db } from '~/services/index';


interface contact {
    id: number;
    name: string;
    email: string;
    phone_number: number;
    address: string;
}

export default function ContactDetails() {
    const contact = useLoaderData<contact>();

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-xl mx-auto bg-white rounded shadow">
                <h1 className="text-2xl font-bold text-center mb-6">Contact Details</h1>
                <div className="px-4 py-2">
                    <p className="font-medium">Name: <span className="text-gray-700">{contact.name}</span></p>
                    <p>Email: <span className="text-gray-700">{contact.email}</span></p>
                    <p>Phone: <span className="text-gray-700">{contact.phone_number}</span></p>
                    <p>Address: <span className="text-gray-700">{contact.address}</span></p>
                </div>
            </div>
        </div>
    );
}

interface LoaderParams {
    id: string;
}

export async function loader({ params }: { params: LoaderParams }) {
    const { id } = params;
    const contact = await db.contacts.findUnique({ where: { id: Number(id) } });
    return contact;
}
