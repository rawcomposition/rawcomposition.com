type Props = {
  id: string;
};

export default function Image({ id }: Props) {
  return <div className="bg-gray-200 rounded p-4">You passed ID: {id}</div>;
}
