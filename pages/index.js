import React, { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
} from "firebase/firestore";
import { app } from "../firebase";

function Home() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [progress, setProgress] = useState("");
  const [products, setProducts] = useState([]);

  const storage = getStorage(app);
  const db = getFirestore(app);

  // Reading product data from cloud firestore
  const getData = async () => {
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(data);
  };

  useEffect(() => {
    getData();
  }, []);

  // uploading file to firebase storage
  const onThumbnail = (e) => {
    const file = e.target.files[0];

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // handling file upload and displaying progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => {},
      () => {
        // getting download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const image = url;
          setThumbnail(image);
        });
      }
    );
  };

  // Adding document to cloud firestore
  async function handleSubmit(e) {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      thumbnail,
      name,
      desc,
    });
    setName("");
    setDesc("");
  }

  return (
    <>
      <div className="grid grid-cols-2 w-1/2 mx-auto gap-7 mt-10">
        {products &&
          products.map((product) => {
            return (
              <div key={product.id}>
                <img src={product.thumbnail} />
                <div className="px-3 pt-2 pb-3 shadow-md">
                  <h2 className="font-bold text-xl">{product.name}</h2>
                  <p className="font-light text-sm">{product.desc}</p>
                </div>
              </div>
            );
          })}
      </div>

      <div className="w-1/3 mx-auto mb-7">
        <h2 className="text-center font-mono font-extrabold mt-32 text-2xl">
          Create a product card with <br /> firebase-9
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="my-2 flex flex-col">
            <label className="text-teal-800 font-bold text-lg tracking-wide">
              Thumbnail
            </label>
            <input
              onChange={onThumbnail}
              type="file"
              className="bg-none border-4 border-teal-900 p-1 focus:outline-none rounded-xl font-bold text-teal-800"
            />
          </div>
          {progress && <h2>Uploading {progress}%</h2>}
          <div className="my-2 flex flex-col">
            <label className="text-teal-800 font-bold text-lg tracking-wide">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="bg-none border-4 border-teal-900 p-1 focus:outline-none rounded-xl font-bold text-teal-800"
            />
          </div>
          <div className="my-2 flex flex-col">
            <label className="text-teal-800 font-bold text-lg tracking-wide">
              Description
            </label>
            <textarea
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
              className="bg-none border-4 border-teal-900 p-1 focus:outline-none rounded-xl font-bold text-teal-800"
            />
          </div>
          <input
            type="submit"
            className="bg-teal-800 w-full mt-2 tracking-wide p-1 focus:outline-none rounded-xl font-bold text-teal-50 text-center"
          />
        </form>
      </div>
    </>
  );
}
export default Home;
