export function ErrorAlert({ message = 'Something went wrong. Please try again.' }: { message?: string }) {
  return (
    <div role="alert" className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
      {message}
    </div>
  );
}
