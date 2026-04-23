import axios from "axios";
import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import Loader from "../ui/Loader";

const Policy = () => {
  const [loading, setLoading] = useState(false);
  const [policyContent, setPolicyContent] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://backndvoo.voo-hub.com/api/policies")
      .then((res) => {
        setPolicyContent(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 px-6 py-5 border-b border-black/10 bg-black/5 backdrop-blur-md text-center">
        <div className="bg-one p-3 rounded-xl shadow-md">
          <FaFileAlt className="text-white text-xl" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-black">Policies</h1>
      </div>
      <div className="flex items-center gap-4 px-6 py-5  mt-8 border-b border-t border-black/10  backdrop-blur-md">
        <div className="bg-one p-3 rounded-xl shadow-md"></div>

        <h1 className="text-2xl md:text-3xl font-bold text-black">
          {policyContent.policies}
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className=" mx-auto">
          <p className="text-black text-lg leading-9 blackspace-pre-line">
            {policyContent.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
