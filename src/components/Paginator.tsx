import { PageInfo, PaginatorClickAction } from "../types/types";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

type PaginatorProps = {
  baseUrl: string | null;
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

const linkBuilder = (baseUrl: string, page: number, fast: boolean = false) => {
  return `${baseUrl}/fields?${!isNaN(page) && page >= 1 ? "page=" + page : ""}${
    fast ? "fast" : ""
  }`;
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
    <PaginationItem active={active}>
      <PaginationLink
        first={first}
        last={last}
        prev={prev}
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
  let { pages, baseUrl, actions } = params;

  if (!pages) {
    return <></>;
  }

  if (!baseUrl) {
    baseUrl = "";
  }

  let { total, perPage, prev, next, page } = pages;
  if (perPage <= 0) {
    perPage = 1;
  }

  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 0 || pages.page > totalPages) {
    return <></>;
  }

  const pageList = Array.from(Array(totalPages).keys());
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
        currPage = currPage + 1;
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
        page: totalPages,
      })}
    </Pagination>
  );
}

export default Paginator;
