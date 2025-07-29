import React from 'react'

const Aboutlayout = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        {/* bg-gradient-to-br from-purple-600 to-blue-500 */}
        <section className="bg-gray-300 text-gray-800 py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold">About Prospect</h1>
            <p className="mt-4 text-lg">
              Connecting People Through Productive and Learning-Based Content
            </p>
          </div>
        </section>
        {/* Mission Section */}
        <section className="py-16  bg-purpleCustom">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
              <p className="mt-4 text-black max-w-xl mx-auto">
                At Prospect, our mission is to create a social media platform
                where users are rewarded for contributing to a culture of
                learning, growth, and productivity. We believe that social media
                can be a space for personal and collective development.
              </p>
            </div>
          </div>
        </section>
        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">
                Meet Our Team
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mx-auto max-w-[860px]">
              {/* Team Member 1 */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                  className="w-24 h-24 mx-auto rounded-full mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800">
                  Aayush Poudel
                </h3>
                <p className="text-gray-600">CEO & Founder</p>
                <p className="mt-2 text-sm text-gray-500">
                  Aayush is passionate about creating platforms that help people
                  learn and grow.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                  className="w-24 h-24 mx-auto rounded-full mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800">Hero Poudel</h3>
                <p className="text-gray-600">CTO</p>
                <p className="mt-2 text-sm text-gray-500">
                  Hero leads our tech team, ensuring the platform runs smoothly
                  and efficiently.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                  className="w-24 h-24 mx-auto rounded-full mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800">Mrs. Poudel</h3>

                <p className="text-gray-600">Head of Marketing</p>
                <p className="mt-2 text-sm text-gray-500">
                  Mrs.Poudel drives our mission forward, spreading the word
                  about Hello's positive impact.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Aboutlayout