"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { PricingPlan, pricingPlan } from "@/lib/pricingplan";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { getStripe } from "@/lib/stripe-client";

type Props = {
  userId: string | undefined;
};

const PricingPage: React.FC<Props> = ({ userId }) => {
  const router = useRouter();

  const checkoutHandler = async (price: number, plan: string) => {
    if (!userId) {
      router.push("/sign-in");
    }
    if (price === 0) {
      return;
    }
    try {
      const { sessionId } = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price, userId, plan }),
      }).then((res) => res.json());

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8 md:mb-16">
        <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl">
          Pricing Options and Plans
        </h1>
        <p className="text-gray-500 mt-2 sm:mt-3 max-w-2xl mx-auto">
          Unlock unlimited credits with early payments and enjoy savings on your plan.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center">
        {pricingPlan.map((plan: PricingPlan, index: number) => (
          <div
            key={index}
            className="relative group transition-all duration-300 flex justify-center"
          >
            {/* Card Shadow */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-600 blur-2xl opacity-50 -z-10 
              rounded-xl group-hover:opacity-70 transition-opacity duration-300 mx-4"
            ></div>

            {/* Card */}
            <Card
              className={`${
                plan.level === "Enterprise" ? "bg-[#1c1c1c] text-white" : ""
              } w-full max-w-sm sm:w-[350px] flex flex-col justify-between transition-transform duration-300 
              group-hover:scale-95 h-full`}
            >
              <CardHeader className="flex flex-row items-center gap-2">
                <CardTitle>{plan.level}</CardTitle>
                {plan.level === "Pro" && (
                  <Badge className="text-center">🚨 Popular</Badge>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-2xl font-bold">{plan.price}</p>
                <ul className="mt-4 space-y-2">
                  {plan.services.map((item: string, index: number) => (
                    <li className="flex items-start" key={index}>
                      <span className="text-green-500 mr-2 mt-1">✔️</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.level === "Enterprise" ? "default" : "outline"}
                  className={`${
                    plan.level === "Enterprise" ? "text-black bg-white hover:bg-gray-100" : ""
                  } w-full`}
                  onClick={() =>
                    checkoutHandler(
                      plan.level === "Pro"
                        ? 29
                        : plan.level === "Enterprise"
                        ? 70
                        : 0,
                      plan.level
                    )
                  }
                >
                  Get started with {plan.level}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;