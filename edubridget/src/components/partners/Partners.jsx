import Slider from "./Slider";

const Partners = () => {
  // Using proven working URLs (same as user's other app)
  const universityPartners = [
    {
      name: "Georgia Institute of Technology",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Georgia_Tech_seal.svg/200px-Georgia_Tech_seal.svg.png"
    },
    {
      name: "Massachusetts Institute of Technology",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/200px-MIT_logo.svg.png"
    },
    {
      name: "Stanford University",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Stanford_University_seal_2003.svg/200px-Stanford_University_seal_2003.svg.png"
    },
    {
      name: "University of California, Berkeley",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seal_of_University_of_California%2C_Berkeley.svg/200px-Seal_of_University_of_California%2C_Berkeley.svg.png"
    },
    {
      name: "Harvard University",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/200px-Harvard_University_coat_of_arms.svg.png"
    },
    {
      name: "University of Oxford",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/200px-Oxford-University-Circlet.svg.png"
    },
    {
      name: "University of Cambridge",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/University_of_Cambridge_coat_of_arms.svg/200px-University_of_Cambridge_coat_of_arms.svg.png"
    },
    {
      name: "Yale University",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Yale_University_Shield_1.svg/200px-Yale_University_Shield_1.svg.png"
    },
  ];
  
return (
    <section className="w-full bg-surface py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          Our University Partners
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          We collaborate with leading Korean universities to provide world-class education opportunities
        </p>
      </div>
      
      <Slider 
        partners={universityPartners} 
        direction="left" 
        bgColor="#f8fafc"
      />
    </section>
  );
};

export default Partners;
