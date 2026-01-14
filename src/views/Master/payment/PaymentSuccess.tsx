// const PaymentSuccess = () => {
//   return (
//     <div className='container d-flex justify-content-center align-items-center vh-100'>
//       <div className='text-center'>
//         <div className='mb-4'>
//           <i className='bi bi-check-circle-fill text-success' style={{ fontSize: '5rem' }}></i>
//         </div>
//         <h1 className='mb-3'>Payment Successful!</h1>
//         <p className='lead'>
//           Thank you for your purchase. Your payment has been processed successfully.
//         </p>
//         <button className='btn btn-success mt-4'>Go to Dashboard</button>
//       </div>
//     </div>
//   )
// }

// export default PaymentSuccess

import { useState, useEffect } from 'react'

const PaymentSuccess = () => {
  const [showAnimation, setShowAnimation] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Trigger animations on mount
    setTimeout(() => setShowAnimation(true), 200)
    setTimeout(() => setShowContent(true), 800)
  }, [])

  const handleDashboard = () => {
    // Navigate to dashboard logic would go here
    console.log('Navigating to dashboard...')
  }

  const handleDownloadReceipt = () => {
    // Download receipt logic would go here
    console.log('Downloading receipt...')
  }

  return (
    <>
      {/* Bootstrap CSS CDN */}
      <link
        href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
        rel='stylesheet'
      />
      <link
        href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css'
        rel='stylesheet'
      />

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          .payment-success-container {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            position: relative;
            overflow: hidden;
          }
          
          .payment-success-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="25" cy="75" r="1" fill="white" opacity="0.05"/><circle cx="75" cy="25" r="1" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          }
          
          .success-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            position: relative;
            z-index: 1;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          .success-card.animate {
            transform: translateY(0);
            opacity: 1;
          }
          
          .success-icon {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            position: relative;
            transform: scale(0);
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
          
          .success-icon.animate {
            transform: scale(1);
          }
          
          .success-icon::before {
            content: '';
            position: absolute;
            width: 140px;
            height: 140px;
            border: 3px solid rgba(16, 185, 129, 0.3);
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(1.2);
              opacity: 0;
            }
          }
          
          .checkmark {
            color: white;
            font-size: 3.5rem;
            animation: checkmark 0.5s ease-in-out 0.3s both;
          }
          
          @keyframes checkmark {
            0% {
              transform: scale(0) rotate(-45deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.2) rotate(-45deg);
              opacity: 1;
            }
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
          }
          
          .content-fade {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease-out;
          }
          
          .content-fade.show {
            opacity: 1;
            transform: translateY(0);
          }
          
          .success-title {
            color: #1f2937;
            font-weight: 700;
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          
          .success-subtitle {
            color: #6b7280;
            font-size: 1.125rem;
            line-height: 1.6;
            margin-bottom: 2rem;
          }
          
          .btn-gradient {
            background: linear-gradient(135deg, #10b981, #059669);
            border: none;
            border-radius: 12px;
            padding: 12px 32px;
            font-weight: 600;
            font-size: 1rem;
            color: white;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .btn-gradient:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            color: white;
          }
          
          .btn-gradient:active {
            transform: translateY(0);
          }
          
          .btn-outline-custom {
            border: 2px solid #e5e7eb;
            background: transparent;
            color: #6b7280;
            border-radius: 12px;
            padding: 10px 24px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          
          .btn-outline-custom:hover {
            border-color: #10b981;
            color: #10b981;
            background: rgba(16, 185, 129, 0.05);
          }
          
          .payment-details {
            background: rgba(16, 185, 129, 0.05);
            border: 1px solid rgba(16, 185, 129, 0.2);
            border-radius: 16px;
            padding: 1.5rem;
            margin: 2rem 0;
          }
          
          .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(16, 185, 129, 0.1);
          }
          
          .detail-item:last-child {
            border-bottom: none;
            font-weight: 600;
            color: #059669;
          }
          
          .floating-elements {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
          }
          
          .floating-element {
            position: absolute;
            opacity: 0.6;
            animation: float 6s ease-in-out infinite;
          }
          
          .floating-element:nth-child(1) {
            top: 10%;
            left: 10%;
            animation-delay: 0s;
          }
          
          .floating-element:nth-child(2) {
            top: 20%;
            right: 10%;
            animation-delay: 2s;
          }
          
          .floating-element:nth-child(3) {
            bottom: 20%;
            left: 15%;
            animation-delay: 4s;
          }
          
          .floating-element:nth-child(4) {
            bottom: 15%;
            right: 20%;
            animation-delay: 1s;
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-20px) rotate(120deg);
            }
            66% {
              transform: translateY(10px) rotate(240deg);
            }
          }
        `}
      </style>

      <div className='d-flex justify-content-center align-items-center position-relative'>
        {/* Floating decorative elements */}
        <div className='floating-elements'>
          <div className='floating-element'>
            <i className='bi bi-star-fill text-white' style={{ fontSize: '1.5rem' }}></i>
          </div>
          <div className='floating-element'>
            <i className='bi bi-heart-fill text-white' style={{ fontSize: '1.2rem' }}></i>
          </div>
          <div className='floating-element'>
            <i className='bi bi-gem text-white' style={{ fontSize: '1.3rem' }}></i>
          </div>
          <div className='floating-element'>
            <i className='bi bi-lightning-fill text-white' style={{ fontSize: '1.4rem' }}></i>
          </div>
        </div>

        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-6 col-md-8 col-sm-10'>
              <div className={`success-card p-5 ${showAnimation ? 'animate' : ''}`}>
                {/* Success Icon */}
                <div className={`success-icon ${showAnimation ? 'animate' : ''} mb-4`}>
                  <i className='bi bi-check-lg checkmark'></i>
                </div>

                {/* Content */}
                <div className={`text-center content-fade ${showContent ? 'show' : ''}`}>
                  <h1 className='success-title'>Payment Successful!</h1>
                  <p className='success-subtitle'>
                    🎉 Congratulations! Your payment has been processed successfully. You should
                    receive a confirmation email shortly.
                  </p>

                  {/* Payment Details */}
                  {/* <div className='payment-details text-start'>
                    <div className='detail-item'>
                      <span>Transaction ID:</span>
                      <span className='font-monospace'>#TXN-2024-001234</span>
                    </div>
                    <div className='detail-item'>
                      <span>Payment Method:</span>
                      <span>•••• •••• •••• 1234</span>
                    </div>
                    <div className='detail-item'>
                      <span>Amount:</span>
                      <span>$99.99</span>
                    </div>
                    <div className='detail-item'>
                      <span>Status:</span>
                      <span>
                        <i className='bi bi-check-circle-fill me-2'></i>
                        Completed
                      </span>
                    </div>
                  </div> */}

                  {/* Action Buttons */}
                  {/* <div className='d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4'>
                    <button className='btn btn-gradient' onClick={handleDashboard}>
                      <i className='bi bi-speedometer2 me-2'></i>
                      Go to Dashboard
                    </button>
                    <button className='btn btn-outline-custom' onClick={handleDownloadReceipt}>
                      <i className='bi bi-download me-2'></i>
                      Download Receipt
                    </button>
                  </div> */}

                  {/* Additional Info */}
                  <div className='mt-4 pt-4 border-top'>
                    <small className='text-muted'>
                      <i className='bi bi-shield-check me-1'></i>
                      Your transaction is secure and encrypted
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentSuccess
