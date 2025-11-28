// src/Home.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";

const imgBase =
  "https://oryuihfxwdlyyhmpfedh.supabase.co/storage/v1/object/public/assets/products/";

// DB style names
const heroBanner = imgBase + "coconut.jpg";
const processImg = imgBase + "processimage.jpg";
const coconutImg = imgBase + "coconut.jpg";
const sunflowerImg = imgBase + "sunflower.jpg";
const groundnutImg = imgBase + "groundnut.jpg";
const bgOil = imgBase + "kuridi.jpg";
const heroimage = imgBase + "heroimage.png"
const sesameImg = imgBase + "sesame.jpg"

export default function Home() {

  useEffect(() => {
    window.scrollTo(0, 0);
  })
  return (
    <div className="font-sans text-gray-800 overflow-hidden">

      {/* HERO SECTION */}
      <section
        className="relative h-[90vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroimage})`,
        }}
      >
        {/* TOP-LEFT BUTTON */}
        <div className="absolute top-6 left-6 z-50">
          <Link
            to="/shop"
            className="text-white text-lg underline underline-offset-4 hover:text-gray-200 transition"
          >
            View Products
          </Link>
        </div>

        {/* HERO TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl text-white px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Pure Oils, Pure Health
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Cold-pressed. Chemical-free. Crafted with care at Siddhi Organics.
          </p>
          <Link
            to="/shop"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
          >
            Shop Now
          </Link>
        </motion.div>
      </section>


      {/* ABOUT SECTION */}
      <section className="py-20 px-6 md:px-20 bg-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-green-700"
        >
          The Siddhi Promise 🌿
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed"
        >
          Every bottle of Siddhi Organics oil is slow-crafted using traditional
          <span className="font-semibold text-green-700"> wooden cold-press </span>
          methods, retaining natural nutrients and flavor. From responsibly
          sourced seeds to sustainable packaging — we bring purity, straight
          from nature.
        </motion.p>

        <motion.img
          src={processImg}
          alt="Cold Press Process"
          className="rounded-2xl shadow-lg mt-12 mx-auto w-full md:w-3/4 object-cover"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
      </section>

      {/* BESTSELLERS */}
      <section className="py-20 px-6 md:px-20 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-green-700">
          Our Bestsellers
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { name: "Cold-Pressed Groundnut Oil", img: groundnutImg },
            { name: "Cold-Pressed Sesame Oil", img: sesameImg },
            { name: "Cold-Pressed Coconut Oil", img: coconutImg },
          ].map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden"
            >
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-3">{p.name}</h3>
                <Link
                  to="/shop"
                  className="text-green-700 hover:text-green-800 font-medium"
                >
                  View Product →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="py-20 bg-green-700 text-white text-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src={bgOil}
          alt="Oil background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4">Start Your Healthy Journey</h2>
          <p className="text-lg mb-8">
            Switch to pure, wooden cold-pressed oils from Siddhi Organics today.
          </p>
          <Link
            to="/shop"
            className="bg-white text-green-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </motion.section>

      {/* MAP SECTION */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-green-700">
          Visit Us
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-2">
          Plot-no 3-100/611, Shop Number 1, Jayabheri Park, Kompally,<br />
          Medchal–Malkajgiri District, Telangana – 500014.
        </p>

        <p className="text-center mt-2">
          <a
            href="https://www.google.com/maps/search/?api=1&query=17.53883608847618,78.48408965278003"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 underline hover:text-green-900"
          >
            Open in Google Maps →
          </a>
        </p>

        <div className="w-full max-w-4xl mx-auto mt-6 rounded-2xl overflow-hidden shadow-lg">
          <iframe
            title="Siddhi Organics Location"
            src="https://www.google.com/maps?q=17.53891,78.48398&z=18&output=embed"
            className="w-full h-[350px] md:h-[450px] border-none"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

        </div>
      </section>




      {/* FOOTER */}
      <Footer />
    </div>
  );
}
