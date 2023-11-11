import { useLoaderData } from '@remix-run/react';
import { db } from '~/services/index';
import { Link } from '@remix-run/react';

export default function Index() {
    const { contacts } = useLoaderData<{ contacts: Contact[] }>();

    return (
        <div className="container mx-auto p-4">
            <Link to="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</Link>
            <h1 className="text-2xl font-bold text-center mb-6" title='Contacts'>Contacts</h1>
            <ul className="list-none space-y-4">
                {contacts.map((contact: Contact) => (
                    <li key={contact.id} className="p-4 border border-gray-200 rounded shadow">
                        <p className="font-medium">Name: {contact.name}</p>
                        <p>Email: {contact.email}</p>
                        <p>Number: {contact.phone_number}</p>
                        <p>Address: {contact.address}</p>
                        <Link to={`/contactDetail/${contact.id}`}>
                            <button>View Details</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

interface Contact {
    id: number;
    name: string;
    email: string;
    phone_number: number;
    address?: string;
}

export async function loader() {
    const contacts = await db.contacts.findMany();
    return { contacts };
}
