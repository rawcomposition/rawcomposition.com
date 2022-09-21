type Props = {
  country: string;
  count: number;
  link?: string;
};

export default function CountryRow({ country, count, link }: Props) {
  return (
    <li className="flex p-2 justify-between">
      {link ? (
        <>
          <a href={link} className="text-orange font-bold">
            <strong>{country}</strong>
          </a>
          <a href={link} className="text-orange">
            <span>{count}</span>
          </a>
        </>
      ) : (
        <>
          <span>{country}</span>
          <span>{count}</span>
        </>
      )}
    </li>
  );
}
