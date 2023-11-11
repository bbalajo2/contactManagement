import { redirect } from '@remix-run/node';
import { Form, useLoaderData, Link } from '@remix-run/react';
import { db } from '~/services/index';

export default function Index() {
    const { contacts } = useLoaderData<{ contacts: contact[] }>();

    return (
        <div className="container mx-auto p-4">
            <Link to="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</Link>
            <h1 className="text-2xl font-bold text-center mb-6" title='Contacts'>Contacts</h1>
            <Form method='get'>
                <input type="text" name="search" placeholder="Search" className="border border-gray-200 rounded shadow p-2" />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
            </Form>
            <ul className="list-none space-y-4">
                {contacts.map((contact: contact) => (
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

export async function loader( { request } : { request: Request }) {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    let queryOptions = {};
    if (search != null) {
        queryOptions = {
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { address: { contains: search, mode: 'insensitive' } },
                ]
            }
        };
    }else {
        redirect("./index")
    }

    const contacts = await db.contacts.findMany(queryOptions);
    return { contacts };
}

interface contact {
    id: number;
    name: string;
    email: string;
    phone_number: number;
    address?: string;
}
