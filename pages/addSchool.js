import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const onSubmit = async (data) => {
    setLoading(true)
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("contact", data.contact);
    formData.append("email_id", data.email_id);

    // append file
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const res = await fetch("/api/addSchool", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setMessage(result.message);
    } catch (err) {
      console.error(err);
      setMessage("Error uploading school");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div>
      <h1 className="h-home">Add School</h1>
      <form className="form-submit" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
       
        <input
          {...register("name", {
            required: "School name is required",
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Name cannot contain numbers or special characters",
            },
          })}
          placeholder="School Name"
        />
        {errors.name && <p style={{ color: "red"}}>{errors.name.message}</p>}

       
        <input
          {...register("address", { required: "Address is required" })}
          placeholder="Address"
        />
        {errors.address && (
          <p style={{ color: "red" }}>{errors.address.message}</p>
        )}

    
        <input
          {...register("city", {
            required: "City is required",
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "City should contain only alphabets",
            },
          })}
          placeholder="City"
        />
        {errors.city && <p style={{ color: "red" }}>{errors.city.message}</p>}

     
        <input
          {...register("state", {
            required: "State is required",
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "State should contain only alphabets",
            },
          })}
          placeholder="State"
        />
        {errors.state && <p style={{ color: "red" }}>{errors.state.message}</p>}

       
        <input
          {...register("contact", {
            required: "Contact number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Contact must be exactly 10 digits",
            },
          })}
          placeholder="Contact"
          maxLength="10"
        />
        {errors.contact && (
          <p style={{ color: "red" }}>{errors.contact.message}</p>
        )}

        
        <input
          {...register("email_id", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email address",
            },
          })}
          placeholder="Email"
        />
        {errors.email_id && (
          <p style={{ color: "red" }}>{errors.email_id.message}</p>
        )}

        <div className="v-center">
          <input
          type="file"
          {...register("image", {
            required: "School image is required",
          })}
           />
        </div>
        {errors.image && (
          <p style={{ color: "red" }}>{errors.image.message}</p>
        )}
           {message && <p>{message}</p>}
      <button className="home-btn pad" type="submit" disabled={loading}>
  {loading ? "Loading..." : "Add School"}
</button>

      </form>

     
      </div>
    </div>
  );
}
