"use server";

import { checkShiprocketServiceability } from "@/lib/shiprocket";

interface PincodeCheckResult {
  success: boolean;
  message?: string;
  city?: string;
  district?: string;
  state?: string;
  deliveryDate?: string;
  estimatedDays?: number;
  codAvailable?: boolean;
  courierName?: string;
}

export async function checkDeliveryPincode(pincode: string): Promise<PincodeCheckResult> {
  const cleanPin = pincode.trim().replace(/\D/g, "");

  if (cleanPin.length !== 6) {
    return {
      success: false,
      message: "Please enter a valid 6-digit Indian postal pincode.",
    };
  }

  try {
    // 1. Verify existence of pincode via Official India Post Postal Directory
    const postalRes = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      next: { revalidate: 86400 }, // Cache 24 hours
    });

    const postalData = await postalRes.json();

    if (!postalData || !postalData[0] || postalData[0].Status !== "Success" || !postalData[0].PostOffice?.length) {
      return {
        success: false,
        message: `Pincode ${cleanPin} is invalid or not found in Indian postal registry.`,
      };
    }

    const postOffice = postalData[0].PostOffice[0];
    const district = postOffice.District || postOffice.Block || "";
    const state = postOffice.State || "";
    const city = postOffice.Division || district || "";

    // 2. Try Shiprocket Serviceability if credentials configured
    let estimatedDays = 3;
    let courierName = "Express Courier (Air Dispatch)";
    let codAvailable = true;

    try {
      const pickupPin = process.env.DISPATCH_PINCODE || "201301"; // Noida dispatch hub
      const shiprocketRes = await checkShiprocketServiceability(pickupPin, cleanPin, true, 0.5);

      if (shiprocketRes && shiprocketRes.data?.available_courier_companies?.length > 0) {
        const couriers = shiprocketRes.data.available_courier_companies;
        const bestCourier = couriers[0];
        courierName = bestCourier.courier_name || "Shiprocket Express";
        codAvailable = Boolean(bestCourier.cod === 1);
        
        if (bestCourier.etd_hours) {
          estimatedDays = Math.max(2, Math.ceil(bestCourier.etd_hours / 24));
        } else if (bestCourier.estimated_delivery_days) {
          estimatedDays = Number(bestCourier.estimated_delivery_days);
        }
      } else {
        // Compute delivery estimate based on geographic state distance from Agra/Noida hub
        estimatedDays = getEstimatedDaysByState(state);
      }
    } catch {
      // Fallback to geographic zone model from Agra / Noida
      estimatedDays = getEstimatedDaysByState(state);
    }

    // Calculate real delivery date (excluding Sunday if applicable)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + estimatedDays);
    
    // If lands on Sunday, bump to Monday
    if (targetDate.getDay() === 0) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const formattedDate = targetDate.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return {
      success: true,
      city,
      district,
      state,
      deliveryDate: formattedDate,
      estimatedDays,
      codAvailable,
      courierName,
    };
  } catch (error: any) {
    console.error("Pincode check error:", error);
    return {
      success: false,
      message: "Unable to verify delivery serviceability right now. Please try again or contact support on WhatsApp.",
    };
  }
}

function getEstimatedDaysByState(stateName: string): number {
  const normState = stateName.toLowerCase();

  // Tier 1 (Same state / adjacent capital region): 1-2 days
  if (normState.includes("delhi") || normState.includes("uttar pradesh") || normState.includes("haryana")) {
    return 2;
  }

  // Tier 2 (North & Central India): 2-3 days
  if (
    normState.includes("rajasthan") ||
    normState.includes("punjab") ||
    normState.includes("madhya pradesh") ||
    normState.includes("chandigarh") ||
    normState.includes("uttarakhand")
  ) {
    return 3;
  }

  // Tier 3 (Western & Eastern India): 3-4 days
  if (
    normState.includes("maharashtra") ||
    normState.includes("gujarat") ||
    normState.includes("bihar") ||
    normState.includes("west bengal") ||
    normState.includes("jharkhand") ||
    normState.includes("odisha") ||
    normState.includes("chhattisgarh")
  ) {
    return 4;
  }

  // Tier 4 (South & North-East / J&K): 4-5 days
  return 5;
}
