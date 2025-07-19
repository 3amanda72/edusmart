import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaSpinner, FaArrowLeft, FaFilePdf, FaFilePowerpoint, FaLink, FaVideo, FaFileAlt } from "react-icons/fa";

const MaterialsContent = () => {
  const { categoryId, materiId } = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (!materiId) return;

    const fetchMaterial = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/materials/${materiId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMaterial(res.data.data);
      } catch (err) {
        console.error("❌ Gagal mengambil materi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materiId]);

  const getFullUrl = (path) => {
  if (!path) return "";
  return path.startsWith("/uploads") ? `http://localhost:5000${path}` : path;
};

  const renderContent = () => {
    if (!material) return <p className="text-red-500">Materi tidak ditemukan.</p>;

    switch (material.type) {
      case "video":
        return (
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
            <iframe
              src={getFullUrl(material.content)}
              className="w-full h-full"
              allowFullScreen
              title="Video Materi"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        );
      case "pdf":
       case "pdf":
  return material.content ? (
    <div className="w-full h-[80vh] rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      <iframe 
        src={getFullUrl(material.content)}
        className="w-full h-full" 
        title="PDF Viewer"
      />
    </div>
  ) : (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p className="text-red-700 flex items-center gap-2">
        <FaFilePdf /> File PDF tidak ditemukan
      </p>
    </div>
  );

      case "ppt":
        return (
          <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-inner">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="bg-purple-100 p-6 rounded-full">
                <FaFilePowerpoint className="text-purple-600 text-4xl" />
              </div>
              <a
                href={getFullUrl(material.content)}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
              >
                <FaFilePowerpoint /> Download File Presentasi
              </a>
              <p className="text-gray-500 text-sm mt-2">Klik untuk mengunduh file PowerPoint</p>
            </div>
          </div>
        );
      case "link":
        return (
          <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-inner">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="bg-blue-100 p-6 rounded-full">
                <FaLink className="text-blue-600 text-4xl" />
              </div>
              <a
                href={material.content}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaLink /> Kunjungi Materi Online
              </a>
              <p className="text-gray-500 text-sm mt-2">Anda akan diarahkan ke situs eksternal</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow-md text-gray-800 whitespace-pre-wrap leading-relaxed">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaFileAlt className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Konten Teks</h3>
            </div>
            <div className="prose max-w-none">
              {material.content || "Konten tidak tersedia."}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <Link
              to={`/materials/${categoryId}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-6 px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              <FaArrowLeft /> Kembali ke Materi
            </Link>

            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-3">Navigasi Materi</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveTab('content')}
                    className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'content' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                  >
                    Konten Utama
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('summary')}
                    className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'summary' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                  >
                    Ringkasan
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {material?.title || "Materi"}
                </h1>
                <p className="text-blue-100 mt-2">
                  {material?.description || "Deskripsi materi"}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex flex-col items-center gap-4">
                  <FaSpinner className="animate-spin text-blue-600 text-4xl" />
                  <p className="text-gray-600">Memuat materi...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tab Content */}
               {activeTab === 'content' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-full ${
                      material?.type === 'video' ? 'bg-red-100 text-red-600' :
                      material?.type === 'pdf' ? 'bg-red-100 text-red-600' :
                      material?.type === 'ppt' ? 'bg-orange-100 text-orange-600' :
                      material?.type === 'link' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {material?.type === 'video' ? <FaVideo /> :
                      material?.type === 'pdf' ? <FaFilePdf /> :
                      material?.type === 'ppt' ? <FaFilePowerpoint /> :
                      material?.type === 'link' ? <FaLink /> :
                      <FaFileAlt />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Jenis Konten</h3>
                      <p className="text-sm text-gray-500 capitalize">{material?.type || 'text'}</p>
                    </div>
                  </div>

                  {renderContent()}
                </div>
              )}

                {activeTab === 'summary' && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Ringkasan Materi
                    </h3>
                    <div className="prose max-w-none">
                      {material?.summary || (
                        <p className="text-gray-500">Belum ada ringkasan tersedia untuk materi ini.</p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsContent;