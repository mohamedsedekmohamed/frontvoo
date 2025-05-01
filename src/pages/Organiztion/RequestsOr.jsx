import React, { useEffect, useState } from 'react';
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import filter from '../../assets/filter.svg';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTranslation } from 'react-i18next';

const RequestsOr = () => {
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const navigate = useNavigate();
       const { t, i18n } = useTranslation();
        const isArabic = i18n.language === 'ar';
  return (
    <div>
      
    </div>
  )
}

export default RequestsOr
  