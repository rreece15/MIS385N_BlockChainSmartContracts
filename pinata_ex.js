export default function SellNFT () {
    async function OnChangeFile(e) {
        var file = e.target.files[0];

        try{
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
            console.log("uploaded file to pinata", response.pinataURL);
            setFileURL(response.pinataURL);
            }
        } catch(e) {
            console.log("error during upload", e);
        }
    }

    async function uploadMetadataToIPFS() {
        const {name,description,price} = formParams;

        if(!name || !description || !price || !fileURL) {
            return;
        }

        const nftJSON = {
            name,description,price,image: fileURL
        };

        try {
            const reponse = await uploadJSONToIPFS(nftJSON);
            if(response.success === true) {
                console.log("Uploaded JSON to pinata ", response);
                return response.pinataURL;
            }
        } catch (e){
            console.log("error uploading JSON metadata", e);
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        try {
            const metadataURL = await uploadMetadataToIPFS();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            updateMessage("Please wait...");

            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi,signer);

            const price = ethers.utils.parseUnits(formParams.price, 'ether');
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            let transaction = await contract.createToken(metadataURL,price, {value: listingPrice});
            await transaction.wait()
            updateMessage("");
            updateFormParams((name:"",description:"",price:""));
            window.location.replace("/");
        } catch (e) {
            alert("upload error"+e);
        }
    }

    return (
        <input type={"file"} onChange={OnChangeFile}></input>
    )
}