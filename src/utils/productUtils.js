const products = [
    { id: '1', name: 'TIKTOK', price: 50000, image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFOTPIPXFYQ5jxGeM1dRABq5tHfaSG0bDNHCTMpqKp5YVm8BXWFaczSRGB317USNrC30w-neo4YFUzbr3qa9yJrC4nD2eab0L-fDGsROuFbZZ38xu93jOf0IC7bCgE5PvybP3LzQy9T_pYhQpDWi1_f5zVnxYtrFEi3JDrFMBnMNne1g4eod0eW8vHHB8/s500/png-transparent-tiktok-tiktok-logo-tiktok-icon-removebg-preview.png' },
    { id: '2', name: 'INSTAGRAM', price: 60000, image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEFUq013710_fQBuwOhlD03dwJaJt11OJ2yui_YaNbu9Qovd7KHyaw1DfRhrtOWp3Ze8QRPGlIPAP69wqAtxmnjzCVGIRdB1gk8fXNDpgTMJfnAepRwRGJgBC_Ah4DFCaPa5Vh2AQ-IXhqqB9O_J0Pl20G5fn2dK3FaBtxDsUFyHH5PPvVbPLYN5OR5rQ/s500/social-media-icons-vector-with-facebook-instagram-twitter-tiktok-youtube-logos-167242-removebg-preview.png' },
    { id: '3', name: 'FACEBOOK', price: 70000, image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEixnDdtIHkvCher8P1cvPt8Xd6Oz08BbJZBOO_gHaplEBsz8_V7o2_sCShLngvRCAbyrX8qFQop-VhwEGhoZVZuJ-3S0pwUk14DSeXkTZxY1WLd5KwzudC8_KtlFJlnop7c41hK4DRCEZpmFpAZU2zmfJ5tv5mphN86K6d-A3aHbwpPXwOi7LiaWMNQhZk/s500/Facebook_Logo_Primary-removebg-preview.png' },
    { id: '4', name: 'YOUTUBE', price: 80000, image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6neW0OZpC2JJt5SiIr3UykIaFAcqDeWhglpwqdmyGhNVAeO9jDpRUFcMpK492IDX9qMBEiRnkq-sZMKAy7TI-CJt9oolMKZ-yd9WK8YniXYBSe3jiGJ-JAYOqvt8gj6Utrb9JA4iRbbxTQbDpUYh2wfZVLKhyT_TmctDbJpUje_vP9tkT0UtePxdkxog/s500/images__1_-removebg-preview.png' },
    { id: '5', name: 'ALAT LIVE', price: 250000, image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbi1aYkU9dbJ3r5Us7SAM0FDk3SjrUtOLwht4y0LZd5C80YbcHYcEZmyAtigzMuYkrlHIh1axC0pqRe3jtUlKLW_qJIk31r7ESSds1WvNbSZoD2nLIUe1xvm9TyFgUJBHprkTUON1J7aKz3x2KqTg7SgQtbfPnOEROiXfRxHVnRuT9cCD7vZt_R4gRPCw/s320/WhatsApp_Image_2024-06-27_at_18.48.22_8c0ddd24__1_-removebg-preview.png' },
    { id: '6', name: 'KONTEN FYP', price: 50000, image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbi1aYkU9dbJ3r5Us7SAM0FDk3SjrUtOLwht4y0LZd5C80YbcHYcEZmyAtigzMuYkrlHIh1axC0pqRe3jtUlKLW_qJIk31r7ESSds1WvNbSZoD2nLIUe1xvm9TyFgUJBHprkTUON1J7aKz3x2KqTg7SgQtbfPnOEROiXfRxHVnRuT9cCD7vZt_R4gRPCw/s320/WhatsApp_Image_2024-06-27_at_18.48.22_8c0ddd24__1_-removebg-preview.png' },
];

const getProductList = () => products;

const getProductById = (id) => products.find(product => product.id === id);

module.exports = { getProductList, getProductById };
