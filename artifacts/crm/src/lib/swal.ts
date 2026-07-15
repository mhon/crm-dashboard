import Swal from "sweetalert2";

const PRIMARY = "#7c3aed";
const DANGER = "#ef4444";
const CANCEL = "#6b7280";

export const swalSuccess = (title: string, text?: string) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    customClass: { popup: "swal-popup" },
  });

export const swalError = (title: string, text?: string) =>
  Swal.fire({
    icon: "error",
    title,
    text: text ?? "Something went wrong. Please try again.",
    confirmButtonColor: PRIMARY,
    customClass: { popup: "swal-popup" },
  });

export const swalConfirmDelete = (itemName: string) =>
  Swal.fire({
    title: "Delete " + itemName + "?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: DANGER,
    cancelButtonColor: CANCEL,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    customClass: { popup: "swal-popup" },
  });

export const swalInfo = (title: string, html: string) =>
  Swal.fire({
    icon: "info",
    title,
    html,
    confirmButtonColor: PRIMARY,
    customClass: { popup: "swal-popup" },
  });
