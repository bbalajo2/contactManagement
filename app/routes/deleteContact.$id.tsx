import { useLoaderData, Form, Link } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { db } from '~/services/index';
import { LoaderParams } from '~/interfaces/interfaces';

/**
 * Validates and loads the ID from the URL params.
 */
export const loader: LoaderFunction = async ({ params }) => {
    const id = validateAndParseId(params.id);
    return { id };
};

/**
 * Handles the deletion of a contact.
 */
export const action: ActionFunction = async ({ params }) => {
    const id = validateAndParseId(params.id);
    await db.contacts.delete({ where: { id } });
    return redirect('/index');
};

/**
 * Validates and parses the ID from URL params.
 */
function validateAndParseId(paramId: string | undefined): number {
    if (!paramId) {
        throw new Response('Not Found', { status: 404 });
    }
    const id = parseInt(paramId, 10);
    if (isNaN(id)) {
        throw new Response('Invalid ID', { status: 400 });
    }
    return id;
}

/**
 * Component to confirm contact deletion.
 */
export default function DeleteContact() {
    const { id } = useLoaderData<LoaderParams>();

    return (
        <div className="container mx-auto p-4">
            <ConfirmationMessage id={id} />
            <CancelButton />
        </div>
    );
}

/**
 * Displays a confirmation message and delete button.
 */
function ConfirmationMessage({ id }: { id: number }) {
    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-6">Confirm Delete</h1>
            <p>Are you sure you want to delete this contact?</p>
            <Form method="post" action={`/deleteContact/${id}`}>
                <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Confirm Delete
                </button>
            </Form>
        </>
    );
}

/**
 * Displays a cancel button to return to the index page.
 */
const CancelButton = () => (
    <Link to="/index" className="block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Cancel
    </Link>
);
