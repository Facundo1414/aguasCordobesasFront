'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb display={"flex"} alignItems={"center"} h={"3rem"} pl={4} py={2} spacing="8px" separator={<ChevronRightIcon color="blue.300" boxSize={8} />}>
      <BreadcrumbItem>
        <Link href="/" passHref>
          <BreadcrumbLink as="span">Inicio</BreadcrumbLink>
        </Link>
      </BreadcrumbItem>
      {pathnames.map((pathname, index) => {
        const href = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <BreadcrumbItem key={href} isCurrentPage={isLast}>
            <Link href={href} passHref>
              <BreadcrumbLink as={isLast ? "span" : "a"}>
                {pathname.charAt(0).toUpperCase() + pathname.slice(1)}
              </BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
