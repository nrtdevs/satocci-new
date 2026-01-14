/* eslint-disable prettier/prettier */

import {
    Pagination,
    PaginationItem,
    PaginationLink
} from "reactstrap";
import { ChevronsLeft, ChevronsRight } from "react-feather";
import { isValid, log } from "../../../utility/helpers/common";
import ReactPaginate from "react-paginate";


const PaginationIconsAndText = ({ total, last_page, per_page, resPerPage = () => { }, resCurrentPage = () => { } }: { total: any, last_page: any, per_page: any, resPerPage: any, resCurrentPage: any }) => {

    const getCounts = () => {
        let re: any = 1
        if (isValid(total) && isValid(per_page)) {


            re = Math.ceil(total / parseInt(per_page))

        }
        return re
    }


    return (
        <div className=''>
            <ReactPaginate
                initialPage={parseInt(last_page) - 1}
                disableInitialCallback
                onPageChange={(page: any) => {

                    resCurrentPage(page?.selected + 1)
                    window.scroll({ top: 0, behavior: 'smooth' })
                }}
                // onClick={(e) => {
                //     resCurrentPage(e?.selected + 1)
                // }}
                pageCount={getCounts()}
                key={parseInt(last_page) - 1}
                nextLabel={''}
                breakLabel={'...'}
                breakClassName='page-item'
                breakLinkClassName='page-link'
                activeClassName={'active'}
                pageClassName={'page-item'}
                previousLabel={''}
                nextLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousClassName={'page-item prev'}
                previousLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                containerClassName={'pagination mb-0 react-paginate justify-content-center'}
            />
        </div>
    );
};

export default PaginationIconsAndText;
