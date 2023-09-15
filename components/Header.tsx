import overview from "lifelist/overview.json";

type Props = {
  noMargin?: boolean;
};

export default function Header({ noMargin }: Props) {
  return (
    <header className={`bg-neutral-800/95 text-gray-200 py-4 ${noMargin ? "" : "mb-12"}`}>
      <div className="container sm:flex">
        <a href="/" className="flex text-[33px] font-bold items-center font-heading">
          <img src="/logo.png" alt="" width="40" height="40" className="mr-2" />
          <span>RawComposition</span>
        </a>
        <nav className="ml-3 mt-2 sm:mt-0 sm:ml-auto flex items-center gap-8 uppercase font-bold text-[0.7rem]">
          <a href="/">Home</a>
          <a href="/about/">About</a>
          <a href="/families/">Families</a>
          <a href={`/lifelist/${overview.years[0]}`}>Life list</a>
        </nav>
      </div>
    </header>
  );
}
