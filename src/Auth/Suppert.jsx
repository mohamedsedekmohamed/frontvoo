import React from 'react'
import voo from '../assets/voo.jpg'
 const Suppert = () => {
  return (
        <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-4 text-one">Contact Support</h2>
          <p className="mb-4 text-gray-700">
            We're here to help! If you have any questions or need assistance, please reach out to us through the following methods:
          </p>
    
    
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-one">Other Contact Information</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
              <strong>Email:</strong>{' '}
<a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=Support@voo-hub.com"
  target="_blank"
  rel="noopener noreferrer"
  className="text-one hover:underline"
>
  Support@voo-hub.com
</a>

      </li>
              <li>
                <strong>Phone Number:</strong> <a href="tel:+0123456789" className="text-one hover:underline">+01004090378</a>
              </li>
            </ul>
          </div>
    
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Delete Account Support </h3>
           
          </div>
          
          <div className="mb-6 text-one">
          To delete your account please contact us on Support@voo-hub.com 
          </div>
          <div> 
            <img src={voo} alt="Voo Logo" className="w-100 h-100 mx-auto mb-4" />
          </div>
        </div>
      );
    };
export default Suppert
