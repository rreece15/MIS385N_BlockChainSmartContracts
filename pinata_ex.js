export default function SellNFT () {

    // this func uploads file, but more generally i included it to show how to incorporate function to JS
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


    // example of displaying image from Ipfs
    function NFTTile (data) {
        const newTo = {
            pathname:"/nftPage/"+data.data.tokenId
        }
    
        const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);
    
        return (
            <Link to={newTo}>
            <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
                <img src={IPFSUrl} alt="" className="w-72 h-80 rounded-lg object-cover" crossOrigin="anonymous" />
                <div className= "text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
                    <strong className="text-xl">{data.data.name}</strong>
                    <p className="display-inline">
                        {data.data.description}
                    </p>
                </div>
            </div>
            </Link>
        )
    }

    // included from above
    export const GetIpfsUrlFromPinata = (pinataUrl) => {
        var IPFSUrl = pinataUrl.split("/");
        const lastIndex = IPFSUrl.length;
        IPFSUrl = "https://ipfs.io/ipfs/"+IPFSUrl[lastIndex-1];
        return IPFSUrl;
    };

    // example of uploading json to ipfs
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

    // example of using WebJS and ethers for architecture flow
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