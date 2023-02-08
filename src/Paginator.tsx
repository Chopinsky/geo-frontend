import { PageInfo, PaginatorClickAction } from "./types/types";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

type PaginatorProps = {
  pages: PageInfo | null;
  actions: PaginatorClickAction;
};

type LinkParams = {
  first: boolean;
  last: boolean;
  prev: boolean;
  next: boolean;
  active: boolean;
  page: number;
  actions: PaginatorClickAction;
};

const buildPaginationLink = ({
  first,
  last,
  prev,
  next,
  active,
  page,
  actions,
}: LinkParams) => {
  return (
    <PaginationItem active={active} key={page}>
      <PaginationLink
        first={first}
        last={last}
        previous={prev}
        next={next}
        href=""
        onClick={() => actions(page)}
      >
        {!first && !last && !prev && !next ? page : ""}
      </PaginationLink>
    </PaginationItem>
  );
};

function Paginator(params: PaginatorProps) {
  let { pages, actions } = params;
  if (!pages) {
    return <></>;
  }

  const { total, prev, next, page } = pages;
  if (total <= 0 || page > total) {
    return <></>;
  }

  const pageList = [];

  // try to centralize the current page in the paginator:
  //   1) starting from the left side
  //   2) then fill 7 total pages from left
  //   3) then fill 7 total pages from right
  let left = Math.max(1, page - 3);
  let right = Math.min(total, left + 6);
  left = Math.max(1, right - 6);

  for (let i: number = left; i <= right; i++) {
    pageList.push(i);
  }

  const defaultLinkParam = {
    first: false,
    last: false,
    prev: false,
    next: false,
    active: false,
    page: 1,
    actions,
  };

  return (
    <Pagination>
      {buildPaginationLink({ ...defaultLinkParam, first: true, page: 1 })}

      {prev
        ? buildPaginationLink({ ...defaultLinkParam, prev: true, page: prev })
        : null}

      {pageList.map((currPage) => {
        return buildPaginationLink({
          ...defaultLinkParam,
          page: currPage,
          active: currPage === page,
        });
      })}

      {next
        ? buildPaginationLink({ ...defaultLinkParam, next: true, page: next })
        : null}

      {buildPaginationLink({
        ...defaultLinkParam,
        last: true,
        page: total,
      })}
    </Pagination>
  );
}

export default Paginator;
