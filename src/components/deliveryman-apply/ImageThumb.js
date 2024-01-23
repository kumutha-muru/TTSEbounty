import { useMediaQuery, useTheme } from "@mui/material";
import React ,{useEffect, useState} from "react";

const ImageThumb = (props) => {
    const { file,type } = props;
    const [thumb, setThumbUrl] = useState(false);
    const [thumbWidth, setThumbWidth] = useState(200);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const handleFileChange = (event) => {
      if(file)
      setThumbUrl(file);  
      else if(!file && type == "identityimage"){
        isSmall? setThumbWidth(270) : setThumbWidth(500);
        setThumbUrl("http://3.108.232.104:91/public/assets/admin/img/900x400/img1.jpg");
      }
      else if(!file && type == "deliverymanimage"){
        isSmall? setThumbWidth(270) : setThumbWidth(500);
        setThumbUrl("http://3.108.232.104:91/public/assets/admin/img/900x400/img1.jpg");
      }
    };
   

    useEffect(()=> {
       handleFileChange();
      },[props]);

    return (<img src={thumb}
        alt={file.name}
        className="img-thumbnail mt-2"
        height={200}
        width={thumbWidth} 
        />);
}
export default ImageThumb;