from fastapi import Query

class PaginationParams:
    """Dependency helper to validate pagination query parameters and compute SQL offsets."""
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number starting at 1"),
        page_size: int = Query(20, ge=1, le=100, description="Number of items per page (maximum 100)")
    ):
        self.page = page
        self.page_size = page_size
        self.offset = (page - 1) * page_size
