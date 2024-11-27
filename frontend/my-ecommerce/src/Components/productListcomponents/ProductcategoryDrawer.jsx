import {
    Button,
    Collapse,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { FaThLarge } from "react-icons/fa"; // Importing icons from react-icons
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Pages/axiosInstance";

function ProductcategoryDrawer() {
  let navigate = useNavigate();
  const [categoriesWithSubcategories, setCategoriesWithSubcategories] =
    useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handlenavigatetoProductList = (subcategoryId, categoryname) => {
    navigate(`/products/${subcategoryId}`, {
      state: { categoryname: categoryname },
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/api/category/get-all"
        );
        const categoriesData = response.data;

        // Fetch subcategories for each category
        const categoriesWithSubcategories = await Promise.all(
          categoriesData.map(async (category) => {
            try {
              const subcategoriesResponse = await axiosInstance.get(
                `http://localhost:5000/api/subcategory/category/${category._id}`
              );
              return {
                ...category,
                subcategories: subcategoriesResponse.data,
              };
            } catch (subError) {
              console.error(
                `Error fetching subcategories for category ${category._id}:`,
                subError
              );
              return { ...category, subcategories: [] }; // fallback to empty array if subcategories not found
            }
          })
        );
        setCategoriesWithSubcategories(categoriesWithSubcategories);
      } catch (error) {
        console.error("Error fetching categories and subcategories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Toggle drawer
  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleCategoryClick = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId); // Toggle the category collapse
  };

  return (
    <div>
      {/* Button to open the Drawer with a filter icon */}
      <Button
        onClick={() => toggleDrawer(true)}
        variant="contained"
        color="secondary"
        className="bg-blue-600 ml-4 text-white font-bold py-3 px-6 rounded-full uppercase shadow-md hover:bg-blue-700 flex items-center"
      >
        <AiOutlineMenuUnfold className="mr-2 text-lg" /> {/* Filter Icon */}
        Filter
      </Button>

      {/* Material UI Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        transitionDuration={300}
        sx={{
          "& .MuiDrawer-paper": {
            padding: "20px",
            backgroundColor: "#f5f5f5", // Light background color
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <div role="presentation">
          <Typography
            variant="h5"
            gutterBottom
            style={{ fontWeight: "bold", color: "#333", marginBottom: "20px" }}
          >
            Explore Our Collections
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />

          <List>
            {categoriesWithSubcategories.map((category) => (
              <div key={category._id}>
                {/* Category List Item */}
                <ListItem
                  button
                  onClick={() => handleCategoryClick(category._id)}
                  sx={{ cursor: "pointer" }}
                >
                  <ListItemIcon>
                    <FaThLarge
                      style={{ color: "#5c6bc0", fontSize: "1.4rem" }}
                    />{" "}
                  </ListItemIcon>
                  <ListItemText
                    primary={category.name}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#333",
                    }}
                  />
                  {expandedCategory === category._id ? "-" : "+"}
                </ListItem>

                <Collapse
                  in={expandedCategory === category._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {category.subcategories.map((subcategory) => (
                      <ListItem
                        key={subcategory._id}
                        button
                        sx={{
                          paddingLeft: "30px", // Indent the subcategories
                          "&:hover": { backgroundColor: "#e8eaf6" }, // Hover effect
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handlenavigatetoProductList(
                            subcategory._id,
                            subcategory.name
                          )
                        }
                      >
                        <ListItemText
                          primary={subcategory.name}
                          primaryTypographyProps={{
                            fontWeight: "normal",
                            fontSize: "1rem",
                            color: "#5c6bc0", // Slightly lighter color for subcategory text
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
                <Divider sx={{ marginBottom: 2 }} />
              </div>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
}

export default ProductcategoryDrawer;
