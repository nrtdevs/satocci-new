/* eslint-disable prettier/prettier */
// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import NavbarBookmarks from './NavbarBookmarks'
import NavbarUserTs from './NavbarUserTs'
import { Badge } from 'reactstrap'
import useUser from '../../../../utility/hooks/useUser'
import { FM, log } from '../../../../utility/helpers/common'


const ThemeNavbar = (props: any) => {
    const domain = window.location.host;

    const user: any = useUser()
    // ** Props
    const { skin, setSkin, setMenuVisibility } = props
    let domainName = ""
    if (window.location.host === "localhost:3000") {
        domainName = `${FM("development")}`
    } else if (window.location.host === "stagingapp.satoccifinance.se") {
        domainName = `${FM("development")}`
    } else if (window.location.host === "app.satoccifinance.se") {
        domainName = `${FM("Production")}`
    }


    return (
        <Fragment>
            <div className='bookmark-wrapper d-flex align-items-center'>
                <h4 className='text-dark fw-bolder text-capitalize' > {domainName}</h4>
                <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
            </div>
            <NavbarUserTs skin={skin} setSkin={setSkin} />
        </Fragment>
    )
}

export default ThemeNavbar
