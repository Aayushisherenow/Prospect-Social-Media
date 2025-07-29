import React from 'react'

const Contactlayout = () => {

  const handlecontact = (e) => { 
    e.preventDefault();
     const email = e.target.email.value.trim();
    const name = e.target.name.value.trim();
    const  message = e.target.message.value.trim();

     const contactinfo = { email, name,message};
    //  console.log(contactinfo);
  }
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="bg-gray-300 text-gray-800 py-20">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl font-bold">Contact Us</h1>
              <p className="mt-4 text-lg">
                We'd love to hear from you! Reach out for any questions or
                feedback.
              </p>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16 bg-purpleCustom">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900">
                  Get In Touch
                </h2>
                <p className="mt-4 text-black max-w-xl mx-auto">
                  Whether you have a question or just want to say hello, feel
                  free to drop us a message below.
                </p>
              </div>

              <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <form onSubmit={handlecontact}>
                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Your Email"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Your Message"
                      rows="5"
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Contact Information
              </h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                {/* Email */}
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Email Us
                  </h3>
                  <p className="text-gray-600">aayushisherenow0@gmail.com</p>
                </div>
                {/* Phone */}
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Call Us
                  </h3>
                  <p className="text-gray-600">+977-9867509131</p>
                </div>
                {/* Address */}
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Visit Us
                  </h3>
                  <p className="text-gray-600">13-Belbas, Butwal, Nepal</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
}

export default Contactlayout