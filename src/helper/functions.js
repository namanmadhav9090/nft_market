import Compressor from "compressorjs";
import toStream from 'it-to-stream';
import FileType from 'file-type';
import nftABI from "../contractData/abis/nft.json";
import escrowABI from "../contractData/abis/escrow.json";
import getContractAddresses from "../contractData/contractAddress/addresses";
import { web3 } from "../web3";
import ipfs from "../config/ipfs";

export async function compressImage(image) {
  return new Promise((resolve, reject) => {
    try {
      new Compressor(image, {
        quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
          resolve(compressedResult);
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
        },
      });
    } catch {
      reject(undefined);
    }
  });
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getContractInstance(isEscrow) {
  const { nftContractAddress, escrowContractAddres } = getContractAddresses();
  const currentaddress = isEscrow ? escrowContractAddres : nftContractAddress;
  const currentABI = isEscrow ? escrowABI : nftABI;
  try {
    if (web3) {
      const contractInstance = new web3.eth.Contract(
        currentABI,
        currentaddress
      );
      return contractInstance;
    }
  } catch (error) {
    // console.log(error);
  }
}

export async function getFileType(url) {
  let ipfsHash = url.substring(url.lastIndexOf('/') + 1) // substract ipfs hash
  const ext = await getFile(ipfsHash);
  return ext.substring(0, ext.lastIndexOf('/'))
}
export function _compactAddress(address) {
  const newAddress = address;
  if (address) {
    return (
      newAddress.substring(0, 5) +
      "...." +
      newAddress.substring(newAddress.length - 10, newAddress.length)
    );
  }
}

export async function getFile(cid) {
  const type = await FileType.fromStream(toStream(ipfs.cat(cid, {})))
  return type.mime
}


export function getFileFormat(fileType) {
  if (fileType.includes('image'))
    return 'image'
  else if (fileType.includes('audio'))
    return 'audio'
  else if (fileType.includes('video'))
    return 'video'
  else
    return 'image'
}