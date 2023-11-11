import { useLoaderData, Form, Link } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { db } from '~/services/index';

interface LoaderData {
    id: number;
}

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.id) {
        throw new Response('Not Found', { status: 404 });
    }
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        throw new Response('Invalid ID', { status: 400 });
    }
    return { id };
};

export const action: ActionFunction = async ({ params }) => {
    if (!params.id) {
        throw new Response('Not Found', { status: 404 });
    }
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        throw new Response('Invalid ID', { status: 400 });
    }
    await db.contacts.delete({
        where: { id }
    });
    return redirect('/index');
};

export default function DeleteContact() {
    const { id } = useLoaderData<LoaderData>();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Confirm Delete</h1>
            <p>Are you sure you want to delete this contact?</p>
            <Form method="post" action={`/deleteContact/${id}`}>
                <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Confirm Delete
                </button>
            </Form>
            <Link to="/index" className="block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Cancel
            </Link>
        </div>
    );
}
