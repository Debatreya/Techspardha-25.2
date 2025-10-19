import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const EVENT_END_DATE = new Date('October 25, 2025 10:47:00 GMT+0530').getTime();

const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = EVENT_END_DATE - now;

    if (difference <= 0) {
        return null;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
};

const AnimatedTimeValue = ({ timeValue, isDay }) => {
    const count = useMotionValue(timeValue);
    const rounded = useTransform(count, latest => {
        const num = Math.round(latest);
        if (isDay) {
            return num.toString();
        } else {
            return num.toString().padStart(2, '0');
        }
    });

    useEffect(() => {
        const animation = animate(count, timeValue, { duration: 0.5 });
        return animation.stop;
    }, [timeValue, count]);

    return (
        <motion.span 
            className=" to-orange-600 text-[#F77039] font-extrabold rounded-xl shadow-lg  border border-[#F77039]
                       flex justify-center items-center transition-all duration-300
                       text-2xl w-[70px] h-[55px]
                       xs:text-3xl xs:w-[75px] xs:h-[60px]
                       sm:text-5xl sm:w-[110px] sm:h-[85px]
                       md:text-6xl md:w-[130px] md:h-[95px]
                       lg:text-7xl lg:w-[150px] lg:h-[110px]
                       xl:text-7xl xl:w-[150px] xl:h-[110px]
                       hover:shadow-[0_0_30px_rgba(255,140,0,0.8),0_0_60px_rgba(255,140,0,0.5),0_0_90px_rgba(255,140,0,0.3)]
                       hover:-translate-y-1" 
            whileHover={{ scale: 1.05 }}
        >
            
            {rounded}
        </motion.span>
    );
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            duration: 0.4
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 }
};

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            if (newTimeLeft === null) {
                clearInterval(timer);
            }
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (timeLeft === null) {
        return null; 
    }

    const timeData = [
        { value: timeLeft.days, label: 'Days', isDay: true },
        { value: timeLeft.hours, label: 'Hours', isDay: false },
        { value: timeLeft.minutes, label: 'Minutes', isDay: false },
        { value: timeLeft.seconds, label: 'Seconds', isDay: false }
    ];

    return (
    <div className="w-full text-white py-8  sm:py-10  md:py-14  lg:py-18  xl:py-18  text-center font-['Inter'] block overflow-hidden mb-[-1px]">
            <style>{`
                @keyframes vibrate {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    25% { transform: translateX(-3px) rotate(-0.5deg); }
                    75% { transform: translateX(3px) rotate(0.5deg); }
                }
                .hover-vibrate:hover {
                    animation: vibrate 0.3s ease-in-out;
                }
            `}</style>
            
            <h1 className="text-orange-500 font-gta tracking-normal  mb-10 sm:mb-10 md:mb-12 lg:mb-14
                           text-5xl xs:text-3xl sm:text-4xl md:text-7xl 
                           px-4">
                TechSpardha Kicks Off In
            </h1>
            
            <motion.div 
                className="flex justify-center gap-2 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-8 flex-wrap px-2" 
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {timeData.map((item, index) => (
                    <motion.div 
                        key={index} 
                        className="flex flex-col items-center hover-vibrate
                                   w-[70px] xs:w-[75px] sm:w-[110px] md:w-[130px] lg:w-[150px] xl:w-[150px]"
                        variants={itemVariants}
                    >
                        <AnimatedTimeValue timeValue={item.value} isDay={item.isDay} />
                        
                        <span className="text-gray-300 uppercase font-semibold mt-2 sm:mt-3 md:mt-4
                                       text-[10px] xs:text-[10px] sm:text-sm md:text-base lg:text-lg xl:text-lg">
                            {item.label}
                        </span>
                    </motion.div>
                ))}
            </motion.div>


        </div>
    );
};

export default CountdownTimer;
