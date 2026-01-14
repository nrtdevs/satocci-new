/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import StatsHorizontal from "../../../@core/components/widgets/stats/StatsHorizontal";
import { CouponType } from "../../../utility/Const";
import { FM, isValid, log } from "../../../utility/helpers/common";
import useUser from "../../../utility/hooks/useUser";
import Show from "../../../utility/Show";
import { abbreviateNumber, CF, formatDate, truncateText } from "../../../utility/Utils";
import { fiXcouponImg, percentageCouponImg } from "./couponImg";
import { Col, Row } from "reactstrap";
import { set } from "react-hook-form";

/* eslint-disable prettier/prettier */
const CouponCard = ({ expiry, discount, level, colors, title, discount_type, currency }: { expiry: any, discount: any, level: any, colors: any, title?: any, discount_type?: any, currency: any }) => {
    const [dynamicImg, setDynamicImg] = useState(fiXcouponImg[Math.floor(Math.random() * fiXcouponImg.length)])
    const [dynamicImg1, setDynamicImg1] = useState(fiXcouponImg[Math.floor(Math.random() * fiXcouponImg.length)])

    const [dicountPrice, setDiscountPrice] = useState(0)
    useEffect(() => {
        if (isValid(discount) && isValid(discount_type)) {
            if (discount_type === CouponType.fixed) {
                //   dynamicImg = fiXcouponImg[Math.floor(Math.random() * fiXcouponImg.length)]
                setDynamicImg(fiXcouponImg[Math.floor(Math.random() * fiXcouponImg.length)])
                setDynamicImg1(fiXcouponImg[Math.floor(Math.random() * fiXcouponImg.length)])
            } else {
                //   dynamicImg = percentageCouponImg[Math.floor(Math.random() * percentageCouponImg.length)]
                setDynamicImg(percentageCouponImg[Math.floor(Math.random() * percentageCouponImg.length)])
                setDynamicImg1(percentageCouponImg[Math.floor(Math.random() * percentageCouponImg.length)])
            }

            if (discount_type === CouponType.fixed) {
                if (discount?.length > 10) {
                    setDiscountPrice(0)
                } else {
                    setDiscountPrice(discount)
                }
            } else {
                if (discount > 100) {
                    setDiscountPrice(0)
                } else {
                    setDiscountPrice(discount)
                }
            }
        }
    }, [discount_type, discount])
    //generate dynamic color for gradient

    const colorsD = [
        `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
        `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
    ]


    const user = useUser()
    return (
        <div
            className="card text-center "
            style={{
                borderRadius: "15px",
                background: `linear-gradient(${colorsD.join(", ")})`

            }}
        >
            <div className="m-1">
                <Row>
                    <Col md="3" >
                        <img
                            src={dynamicImg}
                            // className="img-fluid"
                            alt="coupon"
                            style={{ width: "50px", height: "50px" }}
                        />
                    </Col>
                    <Col md="6">
                        {/* <i className="bi bi-tag-fill text-white"></i> */}
                        <h2 className="card-title text-white text-uppercase fw-bolder ">
                            {title}
                        </h2><br />
                        {/* <i className="bi bi-tag-fill text-white"></i> */}
                        <Show IF={discount_type === CouponType.fixed}>
                            <h1 className="fw-bolder text-white ">

                                {/* {CF({
                                    money: dicountPrice,

                                    currency
                                })} */}
                                <span>{`${currency}  `}{dicountPrice}</span>

                            </h1><br /><br />
                        </Show>
                        <Show IF={discount_type === CouponType.percentage}>
                            <h1 className=" fw-bolder text-white">{dicountPrice}%</h1><br /><br />
                        </Show>
                        <h4 className="card-text fw-bolder text-white fs-5 ">{isValid(expiry) ? `${FM("till-date")} : ${expiry}` : ''}</h4>
                    </Col>
                    <Col md="3" >
                        <img
                            src={dynamicImg1}
                            // className="img-fluid"
                            alt="coupon"
                            style={{ width: "50px", height: "50px", marginTop: "120px", right: "20px" }}
                        />
                    </Col>
                </Row>
            </div>


        </div >
    );
};


export default CouponCard;