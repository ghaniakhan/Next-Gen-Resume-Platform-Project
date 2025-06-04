import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { ADMIN_EMAIL } from "../config";

const AdminRoute = ({ element }) => {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      const user = auth.currentUser;
      if (!user) return setAllowed(false);
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      if (data && data.email === ADMIN_EMAIL && data.role === "admin") {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    };
    checkAccess();
  }, []);

  if (allowed === null) return <div>Checking access...</div>;
  return allowed ? element : <Navigate to="/login" />;
};

export default AdminRoute;
