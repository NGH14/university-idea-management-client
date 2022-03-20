import React from "react";
import { TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import "../User/DetailUserForm/style.css";

import { useFormik } from "formik";
import * as yup from "yup";

import "../User/EditUserForm/style.css";

const CssTextField = styled(TextField)({
    ".MuiFormHelperText-root": {
        fontSize: "14px",
        fontFamily: "Poppins",
    },

    "& .MuiInputBase-root": {
        color: "#000",
        fontSize: "16px",
        fontFamily: "Poppins",
    },
    "& label.Mui-focused": {
        color: "#000",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#000",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderRadius: "5px",
        },
        "&:hover fieldset": {
            border: "1px solid #000000",
        },
        "&.Mui-focused fieldset": {
            border: "1px solid #000000",
        },
    },
});

const ColorButton = styled(Button)(() => ({
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: "bold",
    textTransform: "none",
    minWidth: 200,
    display: "inline-block",

    margin: "10px",
    padding: "10px",

    "&:disabled ": { cursor: "not-allowed", pointerEvents: "all !important" },
}));

function DetailForm(props) {
    const { onClose, initialValue } = props;
    const formik = useFormik({
        initialValues: initialValue || [],
    });

    return (
        <div className="createuserform">
            <div className="createuserform_title">
                <h2>Update Department</h2>
                <IconButton>
                    <CloseIcon onClick={() => onClose()} />
                </IconButton>
            </div>
            <br />

            <form className="form_grid" onSubmit={formik.handleSubmit}>
                <div className="form_group">
                    <div className="form_content">
                        <InputLabel required htmlFor="full_name">
                            Department Name
                        </InputLabel>
                        <CssTextField
                            fullWidth
                            margin="normal"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            variant="standard"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </div>
                </div>
                <div className="createuserform_footer">
                    <ColorButton variant="outlined" onClick={() => onClose()}>
                        Close
                    </ColorButton>
                </div>
            </form>
        </div>
    );
}

export default React.memo(DetailForm);