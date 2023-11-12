import { redirect } from '@remix-run/node';
import { Form, useLoaderData, Link } from '@remix-run/react';
import { db } from '~/services/index';
import { contact as ContactType } from '~/interfaces/interfaces';

/**
 * ContactItem component represents a single contact item.
 */
const ContactItem = ({ contact }: { contact: ContactType }) => (
    <li className="p-4 border border-gray-200 rounded shadow">
        <p className="font-medium">Name: {contact.name}</p>
        <p>Email: {contact.email}</p>
        <p>Number: {contact.phoneNumber}</p>
        <p>Address: {contact.address}</p>
        <Link to={`/contactDetail/${contact.id}`}>
            <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                View Details
            </button>
        </Link>
    </li>
);

/**
 * SearchForm component for filtering contacts.
 */
const SearchForm = () => (
    <Form method='get'>
        <input type="text" name="search" placeholder="Search" className="border border-gray-200 rounded shadow p-2" />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
    </Form>
);

/**
 * ContactsPage component displays a list of contacts.
 */
export default function ContactsPage() {
    const { contacts } = useLoaderData<{ contacts: ContactType[] }>();

    return (
        <div className="container mx-auto p-4">
            <Link to="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</Link>
            <h1 className="text-2xl font-bold text-center mb-6">Contacts</h1>
            <SearchForm />
            <ul className="list-none space-y-4">
                {contacts.map(contact => <ContactItem key={contact.id} contact={contact} />)}
            </ul>
        </div>
    );
}

/**
 * Loader function for fetching contacts with optional search.
 */
export async function loader({ request }: { request: Request }) {
    try {
        const url = new URL(request.url);
        const searchQuery = url.searchParams.get('search');
        let filterOptions = {};
        if (searchQuery) {
            filterOptions = {
                where: {
                    OR: [
                        { name: { contains: searchQuery, mode: 'insensitive' } },
                        { email: { contains: searchQuery, mode: 'insensitive' } },
                        { address: { contains: searchQuery, mode: 'insensitive' } },
                    ]
                }
            };
        }
        const contacts = await db.contacts.findMany(filterOptions);
        return { contacts };
    } catch (error) {
        console.error('Failed to load contacts:', error);
        throw new Response('Failed to load contacts', { status: 500 });
    }
}
