const PINCODE_PREFIX_MAP = {
  // Delhi
  "11": { city: "New Delhi", state: "Delhi" },
  // Haryana & Punjab
  "12": { city: "Gurugram / Faridabad", state: "Haryana" },
  "13": { city: "Ambala / Panipat", state: "Haryana" },
  "14": { city: "Ludhiana / Jalandhar", state: "Punjab" },
  "15": { city: "Bathinda", state: "Punjab" },
  "16": { city: "Chandigarh", state: "Punjab" },
  // Himachal & J&K
  "17": { city: "Shimla", state: "Himachal Pradesh" },
  "18": { city: "Jammu", state: "Jammu & Kashmir" },
  "19": { city: "Srinagar", state: "Jammu & Kashmir" },
  // Uttar Pradesh & Uttarakhand
  "20": { city: "Noida / Ghaziabad / Aligarh", state: "Uttar Pradesh" },
  "21": { city: "Prayagraj / Fatehpur", state: "Uttar Pradesh" },
  "22": { city: "Varanasi / Lucknow", state: "Uttar Pradesh" },
  "23": { city: "Mirzapur / Sonbhadra", state: "Uttar Pradesh" },
  "24": { city: "Bareilly / Moradabad / Dehradun", state: "Uttar Pradesh" },
  "26": { city: "Haldwani / Nainital", state: "Uttarakhand" },
  "27": { city: "Gorakhpur / Basti", state: "Uttar Pradesh" },
  "28": { city: "Agra / Jhansi", state: "Uttar Pradesh" },
  // Rajasthan
  "30": { city: "Jaipur", state: "Rajasthan" },
  "31": { city: "Udaipur / Kota", state: "Rajasthan" },
  "32": { city: "Bharatpur / Sawai Madhopur", state: "Rajasthan" },
  "33": { city: "Bikaner", state: "Rajasthan" },
  "34": { city: "Jodhpur", state: "Rajasthan" },
  // Gujarat
  "38": { city: "Ahmedabad / Gandhinagar", state: "Gujarat" },
  "39": { city: "Surat / Vadodara", state: "Gujarat" },
  "36": { city: "Rajkot / Jamnagar", state: "Gujarat" },
  // Maharashtra & Goa
  "40": { city: "Mumbai / Thane / Goa", state: "Maharashtra" },
  "41": { city: "Pune / Kolhapur", state: "Maharashtra" },
  "42": { city: "Nashik / Jalgaon", state: "Maharashtra" },
  "43": { city: "Aurangabad / Nanded", state: "Maharashtra" },
  "44": { city: "Nagpur / Amravati", state: "Maharashtra" },
  // Madhya Pradesh & Chhattisgarh
  "45": { city: "Indore / Ujjain", state: "Madhya Pradesh" },
  "46": { city: "Bhopal", state: "Madhya Pradesh" },
  "47": { city: "Gwalior", state: "Madhya Pradesh" },
  "48": { city: "Jabalpur", state: "Madhya Pradesh" },
  "49": { city: "Raipur / Bilaspur / Durg", state: "Chhattisgarh" },
  // Andhra Pradesh & Telangana
  "50": { city: "Hyderabad / Secunderabad", state: "Telangana" },
  "51": { city: "Tirupati / Kadapa", state: "Andhra Pradesh" },
  "52": { city: "Vijayawada / Guntur", state: "Andhra Pradesh" },
  "53": { city: "Visakhapatnam", state: "Andhra Pradesh" },
  // Karnataka
  "56": { city: "Bengaluru", state: "Karnataka" },
  "57": { city: "Mangaluru / Mysuru", state: "Karnataka" },
  "58": { city: "Hubballi / Belagavi", state: "Karnataka" },
  "59": { city: "Belgaum / Bagalkot", state: "Karnataka" },
  // Tamil Nadu & Kerala
  "60": { city: "Chennai / Kanchipuram", state: "Tamil Nadu" },
  "61": { city: "Thanjavur / Tiruchirappalli", state: "Tamil Nadu" },
  "62": { city: "Madurai / Dindigul", state: "Tamil Nadu" },
  "63": { city: "Vellore / Salem", state: "Tamil Nadu" },
  "64": { city: "Coimbatore", state: "Tamil Nadu" },
  "67": { city: "Kozhikode / Kannur", state: "Kerala" },
  "68": { city: "Kochi / Ernakulam", state: "Kerala" },
  "69": { city: "Thiruvananthapuram", state: "Kerala" },
  // West Bengal, Odisha & Northeast
  "70": { city: "Kolkata / Howrah", state: "West Bengal" },
  "71": { city: "Hooghly / Burdwan", state: "West Bengal" },
  "72": { city: "Midnapore", state: "West Bengal" },
  "73": { city: "Siliguri / Darjeeling", state: "West Bengal" },
  "74": { city: "North 24 Parganas / Nadia", state: "West Bengal" },
  "75": { city: "Bhubaneswar / Cuttack", state: "Odisha" },
  "76": { city: "Rourkela / Sambalpur", state: "Odisha" },
  "78": { city: "Guwahati", state: "Assam" },
  "79": { city: "Shillong / Agartala / Imphal", state: "Meghalaya / Tripura" },
  // Bihar & Jharkhand
  "80": { city: "Patna", state: "Bihar" },
  "81": { city: "Bhagalpur / Munger", state: "Bihar" },
  "82": { city: "Gaya", state: "Bihar" },
  "83": { city: "Ranchi / Jamshedpur", state: "Jharkhand" },
  "84": { city: "Muzaffarpur", state: "Bihar" },
  "85": { city: "Dhanbad / Bokaro", state: "Jharkhand" }
};
const SPECIFIC_PINCODES = {
  "110001": { city: "Connaught Place, New Delhi", state: "Delhi" },
  "221001": { city: "Varanasi", state: "Uttar Pradesh" },
  "400001": { city: "Fort, Mumbai", state: "Maharashtra" },
  "492001": { city: "Raipur", state: "Chhattisgarh" },
  "490006": { city: "Bhilai", state: "Chhattisgarh" },
  "495001": { city: "Bilaspur", state: "Chhattisgarh" },
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "500001": { city: "Hyderabad", state: "Telangana" },
  "302001": { city: "Jaipur", state: "Rajasthan" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "800001": { city: "Patna", state: "Bihar" },
  "462001": { city: "Bhopal", state: "Madhya Pradesh" },
  "631501": { city: "Kanchipuram", state: "Tamil Nadu" }
};
export async function lookupPincode(pincode) {
  const clean = pincode.trim().replace(/\D/g, "");
  if (clean.length !== 6) return null;
  if (SPECIFIC_PINCODES[clean]) {
    return SPECIFIC_PINCODES[clean];
  }
  const prefix2 = clean.slice(0, 2);
  const fallback = PINCODE_PREFIX_MAP[prefix2] || null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        return {
          city: po.District || po.Block || po.Name || fallback?.city || "",
          state: po.State || fallback?.state || ""
        };
      }
    }
  } catch {
  }
  return fallback;
}
